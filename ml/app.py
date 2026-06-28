import re
import math
import json
import os
import urllib.request
import urllib.parse
import socket
from html.parser import HTMLParser
from collections import defaultdict
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="verai-ml-classifier")

class InferencePayload(BaseModel):
    text: Optional[str] = ""
    url: Optional[str] = ""

# --- Web Scraper HTML Extractor ---
class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_data = []
        self.title_data = []
        self.in_ignored_tag = False
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        if tag in ["script", "style", "head", "meta", "link", "noscript", "header", "footer", "nav"]:
            self.in_ignored_tag = True
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag in ["script", "style", "head", "meta", "link", "noscript", "header", "footer", "nav"]:
            self.in_ignored_tag = False
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_ignored_tag:
            return
        clean_data = data.strip()
        if not clean_data:
            return
            
        if self.in_title:
            self.title_data.append(clean_data)
        else:
            self.text_data.append(clean_data)

    def get_title(self):
        return " ".join(self.title_data)

    def get_text(self):
        return " ".join(self.text_data)

def is_private_ip(ip: str) -> bool:
    try:
        # Loopback
        if ip.startswith("127.") or ip == "::1" or ip == "0.0.0.0":
            return True
        # Private subnets
        if ip.startswith("10.") or ip.startswith("192.168."):
            return True
        if ip.startswith("172."):
            parts = ip.split('.')
            if len(parts) >= 2:
                second_octet = int(parts[1])
                if 16 <= second_octet <= 31:
                    return True
        # Link-local / Cloud Metadata
        if ip.startswith("169.254."):
            return True
        return False
    except Exception:
        return True

def scrape_url(url: str) -> tuple[str, str, str]:
    try:
        parsed_url = urllib.parse.urlparse(url)
        hostname = parsed_url.hostname
        if not hostname:
            return "", "", "Invalid URL hostname"

        # SSRF Protection: Resolve and validate IP address
        try:
            ip = socket.gethostbyname(hostname)
            if is_private_ip(ip):
                return "", "", f"Security Blocked: Target resolves to private IP ({ip})"
        except Exception as host_err:
            return "", "", f"DNS Resolution Failed: {str(host_err)}"

        # Standard browser headers to avoid blocking
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        )
        
        # DoS Protection: Chunked reading with 2 MB cap
        max_size = 2 * 1024 * 1024  # 2 MB
        chunks = []
        bytes_read = 0
        
        with urllib.request.urlopen(req, timeout=5) as response:
            charset = response.headers.get_content_charset() or 'utf-8'
            
            while True:
                chunk = response.read(16384)  # 16 KB chunk
                if not chunk:
                    break
                bytes_read += len(chunk)
                if bytes_read > max_size:
                    return "", "", "Security Blocked: Page size exceeds 2 MB limit"
                chunks.append(chunk)
                
            html = b"".join(chunks).decode(charset, errors='ignore')
            
        parser = HTMLTextExtractor()
        parser.feed(html)
        return parser.get_title(), parser.get_text()[:4000], "" # limit text length for speed
    except Exception as e:
        return "", "", str(e)

# --- Stop Words Filtering ---
STOP_WORDS = {
    'the', 'and', 'are', 'was', 'were', 'has', 'had', 'have', 'but', 'for', 
    'with', 'who', 'its', 'our', 'you', 'they', 'this', 'that', 'these', 'those', 
    'from', 'not', 'his', 'her', 'she', 'him', 'their', 'them', 'been',
    'being', 'there', 'here', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very',
    'can', 'will', 'just', 'should', 'would', 'then', 'once', 'here', 'there',
    'about', 'after', 'again', 'against', 'all', 'am', 'an', 'any', 'are', 'aren',
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between',
    'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do', 'does', 'doing',
    'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
    'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
    'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'me', 'more', 'most', 'my',
    'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
    'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
    'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
    'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
    'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
    'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself',
    'yourselves'
}

# --- Pure Python Bigram Naive Bayes Classifier ---
class NaiveBayesClassifier:
    def __init__(self):
        self.vocab = set()
        self.word_counts = {"real": defaultdict(int), "fake": defaultdict(int)}
        self.class_counts = {"real": 0, "fake": 0}
        self.class_docs = {"real": 0, "fake": 0}
        self.total_docs = 0

    def tokenize(self, text: str) -> list[str]:
        # Convert to lowercase and find all words of length >= 3
        words = re.findall(r'[a-z]{3,}', text.lower())
        filtered_words = [w for w in words if w not in STOP_WORDS]
        tokens = list(filtered_words)
        
        # Add Bigrams of non-stopwords to capture context (e.g. "miracle cure", "study shows")
        for i in range(len(filtered_words) - 1):
            tokens.append(f"{filtered_words[i]} {filtered_words[i+1]}")
            
        return tokens

    def train(self, corpus: list[tuple[str, str]]):
        for text, label in corpus:
            tokens = self.tokenize(text)
            self.class_docs[label] += 1
            self.total_docs += 1
            for token in tokens:
                self.vocab.add(token)
                self.word_counts[label][token] += 1
                self.class_counts[label] += 1
        print(f"Trained Bigram Naive Bayes. Vocab size: {len(self.vocab)}, Docs: {self.total_docs}")

    def predict(self, text: str) -> float:
        tokens = self.tokenize(text)
        # Filter: Ignore out-of-vocabulary words during prediction (reduces OOV bias)
        valid_tokens = [t for t in tokens if t in self.vocab]
        
        if not valid_tokens:
            return 0.5
            
        # Log probability calculation with Laplace smoothing
        log_prob_real = math.log(self.class_docs["real"] / self.total_docs)
        log_prob_fake = math.log(self.class_docs["fake"] / self.total_docs)
        
        vocab_size = len(self.vocab)
        
        for token in valid_tokens:
            # P(token | real)
            count_real = self.word_counts["real"].get(token, 0)
            prob_real = (count_real + 1) / (self.class_counts["real"] + vocab_size)
            log_prob_real += math.log(prob_real)
            
            # P(token | fake)
            count_fake = self.word_counts["fake"].get(token, 0)
            prob_fake = (count_fake + 1) / (self.class_counts["fake"] + vocab_size)
            log_prob_fake += math.log(prob_fake)
            
        # Convert log odds back to normal probability
        max_log = max(log_prob_real, log_prob_fake)
        try:
            exp_real = math.exp(log_prob_real - max_log)
            exp_fake = math.exp(log_prob_fake - max_log)
            prob_real_final = exp_real / (exp_real + exp_fake)
        except Exception:
            prob_real_final = 0.5
            
        return prob_real_final

# --- Stylistic & Keyword Lexicon Engine ---
def analyze_lexicon(text: str) -> float:
    if not text or not text.strip():
        return 0.5
        
    text_lower = text.lower()
    
    # Debunking patterns (strong indicators of hoax/satire discussion)
    debunking_patterns = [
        "no evidence", "lack of evidence", "hoax", "satire", "satirical", 
        "debunked", "unfounded", "false claim", "fabricated", "unverified",
        "social media rumor", "fictional", "conspiracy theory", "misleading claim",
        "fictional research", "imaginary", "self-proclaimed"
    ]
    
    # Sensationalism & Clickbait markers
    clickbait_patterns = [
        "shocking", "secret", "miracle", "cure", "won't believe", "wont believe",
        "conspiracy", "warning", "expose", "hidden truth", "magic pill", "absolute proof",
        "mind-blowing", "aliens", "ufo", "scam", "fake news", "fraud", "unbelievable",
        "inside job", "critical alert", "forbidden", "leak", "cover-up", "elites",
        "hide this", "they want to", "revealed", "hiding proof", "what this", "hack",
        "exposed", "conspiracies", "conspiracy exposed", "arrested", "banned",
        "emergency", "illegal", "danger", "deadly", "crisis", "disaster", "poison", "toxic",
        "giant hamster", "hamster-powered", "tabby cat"
    ]
    
    # Factual & Journalistic markers (use word boundaries to avoid matching substrings)
    factual_patterns = [
        r"\bresearchers\b", r"\bstudy\b", r"\bofficial\b", r"\bspokesperson\b", 
        r"\bconfirmed\b", r"\bannounced\b", r"\breporting\b", r"\breports\b", 
        r"\bjournal\b", r"\bpeer-reviewed\b", r"\bscientists\b", r"\baccording to\b",
        r"\bpublished in\b", r"\bstatistics\b", r"\brepresentative\b", r"\bstatement\b", 
        r"\bagency\b", r"\bguidelines\b", r"\bauthority\b", r"\bspokesman\b", 
        r"\bdeclared\b", r"\bmeteorologists\b", r"\bdepartment\b", r"\bnegotiations\b",
        r"\bagreements\b", r"\bmediators\b"
    ]
    
    debunk_score = 0
    for p in debunking_patterns:
        debunk_score += text_lower.count(p)
        
    clickbait_score = 0
    for p in clickbait_patterns:
        clickbait_score += text_lower.count(p)
        
    factual_score = 0
    for p in factual_patterns:
        matches = re.findall(p, text_lower)
        factual_score += len(matches)
        
    # Check for "evidence" but exclude "no evidence" or "lack of evidence"
    evidence_matches = len(re.findall(r"\bevidence\b", text_lower))
    negated_evidence = text_lower.count("no evidence") + text_lower.count("lack of evidence") + text_lower.count("without evidence")
    valid_evidence = max(0, evidence_matches - negated_evidence)
    factual_score += valid_evidence
    
    exclamations = text.count("!")
    words = text.split()
    caps_count = 0
    for w in words:
        if len(w) > 3 and w.isupper() and w.isalpha():
            caps_count += 1
            
    # Calculate score starting at 0.5
    score = 0.5
    
    # Adjust based on clickbait vs factual matches
    score -= min(clickbait_score * 0.15, 0.45)
    score -= min(debunk_score * 0.35, 0.50) # strong negative weight for debunk markers!
    score += min(factual_score * 0.10, 0.35)
    
    # Adjust based on style markers
    score -= min(caps_count * 0.10, 0.25)
    score -= min(exclamations * 0.08, 0.20)
    
    return max(0.05, min(0.95, score))

# --- Load Training Corpus dynamically from news_dataset.json ---
training_corpus = []
dataset_path = os.path.join(os.path.dirname(__file__), "news_dataset.json")

try:
    if os.path.exists(dataset_path):
        with open(dataset_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            training_corpus = [(item["text"], item["label"]) for item in data]
        print(f"Successfully loaded {len(training_corpus)} training entries from {dataset_path}")
except Exception as err:
    print(f"Error loading training dataset file: {str(err)}")

if not training_corpus:
    training_corpus = [
        ("SHOCKING! Secret alien landing covered up by the government!", "fake"),
        ("Researchers publish new study in science journal detailing renewable energy growth.", "real")
    ]
    print("Warning: Fallback default corpus loaded.")

# Instantiate and train model
classifier = NaiveBayesClassifier()
classifier.train(training_corpus)

def analyze_url_domain(url: str) -> tuple[float, str]:
    if not url or not url.strip():
        return 0.5, "neutral"
        
    url = url.lower()
    reputable_domains = [
        ".gov", ".edu", "reuters.com", "apnews.com", "bbc.com", "bbc.co.uk", 
        "nytimes.com", "wikipedia.org", "science.org", "nature.com", 
        "theguardian.com", "npr.org", "bloomberg.com", "wsj.com"
    ]
    unreliable_domains = [
        "infowars.com", "nationalenquirer.com", "blogspot.com", "wordpress.com", 
        "buzzfeed.com", "dailymail.co.uk", "clickbait", "fakenews", "conspiracy",
        "breitbart.com", "gatewaypundit.com", "naturalnews.com"
    ]
    
    for domain in reputable_domains:
        if domain in url:
            return 0.85, "trusted"
            
    for domain in unreliable_domains:
        if domain in url:
            return 0.15, "unreliable"
            
    return 0.5, "neutral"

@app.get('/health')
async def health():
    return {"status": "ok", "service": "verai-ml"}

@app.post('/infer')
async def infer(payload: InferencePayload):
    text = payload.text or ""
    url = payload.url or ""
    
    scraped_title = ""
    scraped_text = ""
    scrape_error = ""
    
    # 1. Scraping Step if URL is provided
    if url and url.strip():
        scraped_title, scraped_text, scrape_error = scrape_url(url)
        if not scrape_error:
            # Evaluate the scraped page body
            text = f"{scraped_title}. {scraped_text}"
            
    # 2. Domain analysis (trust modifier)
    url_score, url_label = analyze_url_domain(url)
    
    # 3. Model Classification + Lexicon Blending
    model_score = classifier.predict(text)
    lexicon_score = analyze_lexicon(text)
    
    # Blend NLP Model (45%) and Heuristic Lexicon (55%) for general accuracy
    nlp_score = (model_score * 0.45) + (lexicon_score * 0.55)
    
    # 4. Final blender (Combine Text NLP and Domain Trust)
    if url and not scrape_error:
        final_score = (url_score * 0.3) + (nlp_score * 0.7)
    elif url:
        final_score = url_score
    else:
        final_score = nlp_score
        
    # Scale verdict boundaries with safety buffer
    if final_score >= 0.58:
        verdict = "real"
        confidence = 0.55 + ((final_score - 0.58) / 0.37) * 0.40
    elif final_score <= 0.42:
        verdict = "fake"
        confidence = 0.55 + ((0.42 - final_score) / 0.37) * 0.40
    else:
        verdict = "unknown"
        confidence = 0.40 + abs(final_score - 0.5) * 0.20
        
    return {
        "verdict": verdict,
        "confidence": round(float(confidence), 2),
        "score": round(float(final_score), 2),
        "url_label": url_label,
        "scraped_title": scraped_title,
        "scrape_error": scrape_error,
        "features": {
            "has_url": bool(url),
            "has_text": bool(text),
            "scraped_length": len(text)
        }
    }
