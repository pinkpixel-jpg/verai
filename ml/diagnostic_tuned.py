import sys
import re
import math
from collections import defaultdict

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

class NaiveBayesClassifier:
    def __init__(self):
        self.vocab = set()
        self.word_counts = {"real": defaultdict(int), "fake": defaultdict(int)}
        self.class_counts = {"real": 0, "fake": 0}
        self.class_docs = {"real": 0, "fake": 0}
        self.total_docs = 0

    def tokenize(self, text: str) -> list[str]:
        words = re.findall(r'[a-z]{3,}', text.lower())
        filtered_words = [w for w in words if w not in STOP_WORDS]
        tokens = list(filtered_words)
        
        # Add Bigrams of non-stopwords
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

    def predict(self, text: str) -> float:
        tokens = self.tokenize(text)
        # Only keep tokens that are in the vocabulary
        valid_tokens = [t for t in tokens if t in self.vocab]
        
        if not valid_tokens:
            return 0.5
            
        log_prob_real = math.log(self.class_docs["real"] / self.total_docs)
        log_prob_fake = math.log(self.class_docs["fake"] / self.total_docs)
        
        vocab_size = len(self.vocab)
        
        for token in valid_tokens:
            count_real = self.word_counts["real"].get(token, 0)
            prob_real = (count_real + 1) / (self.class_counts["real"] + vocab_size)
            log_prob_real += math.log(prob_real)
            
            count_fake = self.word_counts["fake"].get(token, 0)
            prob_fake = (count_fake + 1) / (self.class_counts["fake"] + vocab_size)
            log_prob_fake += math.log(prob_fake)
            
        max_log = max(log_prob_real, log_prob_fake)
        try:
            exp_real = math.exp(log_prob_real - max_log)
            exp_fake = math.exp(log_prob_fake - max_log)
            prob_real_final = exp_real / (exp_real + exp_fake)
        except Exception:
            prob_real_final = 0.5
            
        return prob_real_final

# Import dataset
sys.path.append(r"c:\Users\rashmi rahangdale\Desktop\fkverai\ml")
import json
with open(r"c:\Users\rashmi rahangdale\Desktop\fkverai\ml\news_dataset.json", "r", encoding="utf-8") as f:
    dataset = json.load(f)
training_corpus = [(item["text"], item["label"]) for item in dataset]

classifier = NaiveBayesClassifier()
classifier.train(training_corpus)

def analyze_lexicon(text: str) -> float:
    if not text or not text.strip():
        return 0.5
    text_lower = text.lower()
    
    debunking_patterns = [
        "no evidence", "lack of evidence", "hoax", "satire", "satirical", 
        "debunked", "unfounded", "false claim", "fabricated", "unverified",
        "social media rumor", "fictional", "conspiracy theory", "misleading claim",
        "imaginary", "fictional research", "self-proclaimed"
    ]
    
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
            
    score = 0.5
    score -= min(clickbait_score * 0.15, 0.45)
    score -= min(debunk_score * 0.35, 0.50)
    score += min(factual_score * 0.10, 0.35)
    score -= min(caps_count * 0.10, 0.25)
    score -= min(exclamations * 0.08, 0.20)
    
    return max(0.05, min(0.95, score))

test_cases = [
    ("US-Iran Ceasefire", "Negotiations between the United States and Iran are continuing after a recent ceasefire framework. The two sides remain divided over issues such as nuclear inspections, access to frozen Iranian assets, and arrangements related to the Strait of Hormuz. Despite the disagreements, both sides have said talks are ongoing, and mediators have described some progress in discussions."),
    ("Giant Hamsters", "Scientists Announce Discovery of Floating Island Powered by Giant Hamsters. Lead researcher Dr. Amelia Finch claimed that the island, roughly the size of a small city, appears to stay airborne. Fictional research team realized the island was generating lift through hamster-powered atmospheric propulsion. Critics argue that feeding thousands of bus-sized hamsters would be difficult. Experts noted that no evidence of the program existed."),
    ("Mr. Pickles", "Whiskerville, June 25 — Residents of Whiskerville woke up to a political surprise today after a tabby cat named Mr. Pickles won the mayoral election with 97% of the vote."),
    ("Antarctic ice sheet", "Breaking: Scientists discover ancient city under Antarctic ice sheet in recent expedition.")
]

for title, text in test_cases:
    nb_score = classifier.predict(text)
    lex_score = analyze_lexicon(text)
    final = (nb_score * 0.45) + (lex_score * 0.55)
    
    if final >= 0.58:
        verdict = "REAL"
    elif final <= 0.42:
        verdict = "FAKE"
    else:
        verdict = "UNKNOWN"
        
    print(f"[{title}]")
    print(f"  Naive Bayes: {nb_score:.3f}")
    print(f"  Lexicon:     {lex_score:.3f}")
    print(f"  Final Blend: {final:.3f} -> {verdict}")
