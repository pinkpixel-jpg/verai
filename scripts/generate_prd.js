const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, PageBreak, TableOfContents
} = require('docx');
const fs = require('fs');

const BRAND_BLUE = "1A3C5E";
const BRAND_RED = "C0392B";
const ACCENT_TEAL = "0F7B6C";
const LIGHT_BG = "EBF5FB";
const LIGHT_RED = "FDEDEC";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_BLUE, space: 4 } },
    children: [new TextRun({ text, bold: true, size: 32, color: BRAND_BLUE, font: "Arial" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 26, color: BRAND_BLUE, font: "Arial" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 22, color: ACCENT_TEAL, font: "Arial" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function tableRow(label, value, header = false) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 3000, type: WidthType.DXA },
        shading: { fill: header ? BRAND_BLUE : LIGHT_BG, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: header || true, size: 20, font: "Arial", color: header ? "FFFFFF" : "000000" })] })]
      }),
      new TableCell({
        borders,
        width: { size: 6360, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Arial" })] })]
      })
    ]
  });
}

function infoTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 6360],
    rows: rows.map(([l, v]) => tableRow(l, v))
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: BRAND_BLUE },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: BRAND_BLUE },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: ACCENT_TEAL },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({ spacing: { before: 2000, after: 200 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "VERIFAI", bold: true, size: 72, font: "Arial", color: BRAND_BLUE })] }),
      new Paragraph({ spacing: { before: 0, after: 120 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Fake News Detection Platform", size: 36, font: "Arial", color: BRAND_RED })] }),
      new Paragraph({ spacing: { before: 400, after: 80 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "PRODUCT REQUIREMENTS DOCUMENT (PRD)", bold: true, size: 28, font: "Arial", color: "555555" })] }),
      new Paragraph({ spacing: { before: 80, after: 80 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Version 1.0  |  June 2026  |  CONFIDENTIAL", size: 20, font: "Arial", color: "888888" })] }),
      pageBreak(),
      h1("Table of Contents"),
      para("1. Executive Summary"),
      para("2. Product Overview"),
      para("3. Goals & Success Metrics"),
      para("4. User Personas"),
      para("5. Functional Requirements"),
      para("6. Non-Functional Requirements"),
      para("7. User Stories & Acceptance Criteria"),
      para("8. Feature Roadmap"),
      para("9. Risk Assessment"),
      para("10. Appendix"),
      pageBreak(),
      h1("1. Executive Summary"),
      para("VERIFAI is an AI-powered fake news detection platform designed to combat the growing epidemic of misinformation online. By combining advanced Natural Language Processing (NLP), machine learning models, real-time web credibility analysis, and community-driven verification, VERIFAI gives individuals, journalists, educators, and enterprises the tools to determine the authenticity of news articles, social media posts, and digital content at scale."),
      para("The platform addresses a critical global need: according to Reuters Institute's 2025 Digital News Report, over 63% of internet users encounter suspected misinformation weekly, yet only 12% have access to reliable fact-checking tools. VERIFAI bridges this gap with a seamless, multi-modal detection interface backed by enterprise-grade infrastructure on Supabase."),
      h2("1.1 Mission Statement"),
      para("To democratize access to truth verification technology and build a more informed society by making fact-checking fast, transparent, and accessible to everyone."),
      h2("1.2 Product Vision"),
      para("VERIFAI will become the world's most trusted AI-powered fact-checking platform — the first tool journalists, researchers, and everyday citizens reach for when news seems suspicious."),
      h2("1.3 Document Scope"),
      para("This PRD covers the complete product specification for VERIFAI v1.0, including all features, user stories, technical requirements, non-functional requirements, and the 18-month feature roadmap."),
      pageBreak(),
      h1("2. Product Overview"),
      h2("2.1 Problem Statement"),
      para("The proliferation of fake news causes measurable harm at every level of society:"),
      bullet("Political misinformation distorts election outcomes and undermines democratic institutions"),
      bullet("Health misinformation during the COVID-19 pandemic caused thousands of preventable deaths"),
      bullet("Financial fake news triggers market volatility and destroys investor wealth"),
      bullet("Social misinformation fuels hate crimes, civil unrest, and cultural polarization"),
      bullet("Existing fact-checking tools are slow (24-72 hour turnaround), manual, and unscalable"),
      h2("2.2 Solution Overview"),
      para("VERIFAI offers a comprehensive, multi-layered detection system:"),
      h3("Core Detection Engine"),
      bullet("ML-based text classification using fine-tuned BERT and RoBERTa models"),
      bullet("Source credibility scoring from 50,000+ curated media outlet database"),
      bullet("Cross-reference engine that checks claims against verified fact databases"),
      bullet("Sentiment and bias analysis to detect emotionally manipulative language"),
      bullet("Image and video authenticity detection via metadata and reverse search"),
      h3("User Interfaces"),
      bullet("Web application (Next.js) with real-time analysis dashboard"),
      bullet("Browser extension for instant in-browser fact-checking"),
      bullet("REST API for enterprise integrations"),
      bullet("Mobile apps (React Native) for iOS and Android"),
      h2("2.3 Product Positioning"),
      infoTable([
        ["Product", "VERIFAI — Fake News Detection Platform"],
        ["Category", "AI/ML SaaS — Media Integrity & Information Security"],
        ["Primary Market", "Individual users, journalists, educational institutions, enterprises"],
        ["Revenue Model", "Freemium (Free / Pro / Enterprise tiers)"],
        ["Launch Date", "Q1 2027"],
        ["Platform", "Web, Mobile (iOS/Android), Browser Extension, API"],
      ]),
      pageBreak(),
      h1("3. Goals & Success Metrics"),
      h2("3.1 Business Goals"),
      bullet("Acquire 100,000 registered users within 6 months of launch"),
      bullet("Achieve 5,000 Pro subscribers by end of Year 1"),
      bullet("Onboard 20 enterprise clients within 12 months"),
      bullet("Reach $2M ARR by end of Year 2"),
      bullet("Establish partnerships with 10+ major news organizations"),
      h2("3.2 Product Goals"),
      bullet("Achieve >92% accuracy on the LIAR benchmark dataset"),
      bullet("Deliver analysis results in under 3 seconds for 95% of requests"),
      bullet("Support analysis in 15+ languages by v1.5"),
      bullet("Process 1 million article analyses per month by Month 12"),
      bullet("Maintain 99.9% platform uptime SLA"),
      h2("3.3 Key Performance Indicators (KPIs)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3500, 2500, 3360],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, shading: { fill: BRAND_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "KPI", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: BRAND_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Target (6 mo)", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: BRAND_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Target (12 mo)", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }),
          ]}),
          ...[
            ["Monthly Active Users", "25,000", "100,000"],
            ["Detection Accuracy", "90%", "92%+"],
            ["Avg. Response Time", "< 4 seconds", "< 3 seconds"],
            ["Pro Conversion Rate", "3%", "5%"],
            ["NPS Score", "> 45", "> 60"],
            ["API Uptime", "99.5%", "99.9%"],
          ].map(([kpi, t6, t12]) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: kpi, size: 20, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: LIGHT_BG, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: t6, size: 20, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 3360, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: t12, size: 20, font: "Arial" })] })] }),
          ]}))
        ]
      }),
      pageBreak(),
      h1("4. User Personas"),
      h2("4.1 Persona 1: The Concerned Citizen — Priya, 34"),
      infoTable([
        ["Role", "Secondary School Teacher, Pune"],
        ["Tech Comfort", "Moderate — daily smartphone user, occasional laptop"],
        ["Goals", "Verify news before sharing on WhatsApp family groups"],
        ["Pain Points", "Overwhelmed by viral misinformation; doesn't know which sources to trust"],
        ["Key Feature Needs", "Simple URL paste-and-check; clear visual verdict; shareable report"],
      ]),
      h2("4.2 Persona 2: The Investigative Journalist — Arjun, 29"),
      infoTable([
        ["Role", "Digital Reporter, National News Agency, Delhi"],
        ["Tech Comfort", "High — uses Slack, CMS, social listening tools daily"],
        ["Goals", "Rapidly verify breaking news claims before publishing; cite sources confidently"],
        ["Pain Points", "Manual fact-checking takes hours; editors demand speed without sacrificing accuracy"],
        ["Key Feature Needs", "Batch analysis, source credibility reports, exportable evidence packages, API access"],
      ]),
      h2("4.3 Persona 3: The Enterprise Compliance Officer — Meera, 42"),
      infoTable([
        ["Role", "Head of Digital Trust, Large Indian Bank"],
        ["Tech Comfort", "High — manages compliance software, data dashboards"],
        ["Goals", "Monitor for financial misinformation that could affect bank reputation or stock price"],
        ["Pain Points", "No automated monitoring system; team manually scans thousands of articles weekly"],
        ["Key Feature Needs", "Real-time monitoring alerts, bulk API, custom keyword tracking, compliance reporting"],
      ]),
      pageBreak(),
      h1("5. Functional Requirements"),
      h2("5.1 Authentication & User Management"),
      bullet("Email/password registration with email verification"),
      bullet("OAuth login via Google, GitHub, LinkedIn"),
      bullet("Magic link authentication for passwordless login"),
      bullet("Role-based access control: Guest, Free, Pro, Enterprise, Admin"),
      bullet("JWT-based session management with Supabase Auth"),
      bullet("User profile management with API key generation"),
      bullet("Two-factor authentication (2FA) for Pro and Enterprise tiers"),
      bullet("GDPR-compliant data deletion and export features"),
      h2("5.2 Core Detection Features"),
      h3("5.2.1 URL Analysis"),
      bullet("Paste any article URL for instant analysis"),
      bullet("Auto-extract article title, body, author, publication date, and metadata"),
      bullet("Return credibility score (0-100), category label (Real/Fake/Satire/Misleading/Unverified), and confidence percentage"),
      bullet("Display source credibility rating from curated database"),
      h3("5.2.2 Text Analysis"),
      bullet("Direct text paste (up to 10,000 characters free, unlimited Pro)"),
      bullet("Highlight suspicious phrases and emotionally manipulative language"),
      bullet("Detect linguistic patterns associated with propaganda and clickbait"),
      h3("5.2.3 Social Media Post Analysis"),
      bullet("Analyze Twitter/X, Facebook, Instagram, and WhatsApp-forwarded text"),
      bullet("Detect out-of-context images and misleading captions"),
      bullet("Identify coordinated inauthentic behavior patterns"),
      h3("5.2.4 Image & Video Analysis (Pro/Enterprise)"),
      bullet("Reverse image search to detect reused/out-of-context images"),
      bullet("AI-generated image detection (deepfake identification)"),
      bullet("EXIF metadata analysis and GPS verification"),
      bullet("Video thumbnail fact-checking"),
      h2("5.3 Dashboard & Analytics"),
      bullet("Personal analysis history with searchable, filterable records"),
      bullet("Trend dashboard showing most-analyzed topics and fake news hotspots"),
      bullet("Real-time misinformation alerts for tracked keywords/sources"),
      bullet("Comparative analysis: batch-compare up to 10 articles"),
      bullet("Visual bias spectrum chart for political leanings"),
      bullet("Weekly digest report delivered via email"),
      h2("5.4 Community & Collaboration"),
      bullet("Community voting on disputed verdicts"),
      bullet("Expert verification network — verified journalists can flag/confirm analyses"),
      bullet("Public leaderboard for top fact-checkers"),
      bullet("Shareable analysis report cards with unique URLs"),
      bullet("Embed widget for news organizations to display VERIFAI ratings"),
      pageBreak(),
      h1("6. Non-Functional Requirements"),
      h2("6.1 Performance"),
      bullet("95th percentile API response time: < 3 seconds"),
      bullet("Page load time: < 2 seconds on 4G connection"),
      bullet("Support 10,000 concurrent users without degradation"),
      bullet("Database queries: < 100ms for 99% of reads"),
      h2("6.2 Security"),
      bullet("SOC 2 Type II compliance roadmap"),
      bullet("All data encrypted in transit (TLS 1.3) and at rest (AES-256)"),
      bullet("OWASP Top 10 protections implemented"),
      bullet("Rate limiting: 100 requests/hour (Free), 1000/hour (Pro), unlimited (Enterprise)"),
      bullet("Penetration testing every 6 months"),
      bullet("No PII stored in ML model training data"),
      h2("6.3 Scalability"),
      bullet("Horizontally scalable microservices architecture"),
      bullet("Auto-scaling on Supabase Edge Functions based on demand"),
      bullet("CDN distribution via Vercel Edge Network"),
      bullet("Database connection pooling via Supabase PgBouncer"),
      h2("6.4 Accessibility"),
      bullet("WCAG 2.1 Level AA compliance"),
      bullet("Full keyboard navigation support"),
      bullet("Screen reader compatibility (ARIA labels)"),
      bullet("Mobile-first responsive design"),
      bullet("Support for 15+ languages including Hindi, Tamil, Bengali"),
      h2("6.5 Availability & Reliability"),
      bullet("99.9% uptime SLA for Pro/Enterprise"),
      bullet("Automated failover with multi-region Supabase deployment"),
      bullet("Daily automated database backups with 30-day retention"),
      bullet("Disaster recovery RTO: 4 hours, RPO: 1 hour"),
      pageBreak(),
      h1("7. User Stories & Acceptance Criteria"),
      h2("7.1 Epic: Article Analysis"),
      para("US-001: As a free user, I want to paste a URL and get an instant fake news verdict so I can decide whether to share an article.", { bold: true }),
      para("Acceptance Criteria:"),
      bullet("Given a valid article URL, the system returns a verdict within 5 seconds"),
      bullet("Verdict includes a credibility score (0-100), label, and confidence percentage"),
      bullet("Source credibility rating is displayed alongside the verdict"),
      bullet("Result is stored in the user's analysis history"),
      bullet("Analysis works for URLs from all major Indian and international news sites"),
      para("US-002: As a journalist, I want to batch-analyze up to 50 URLs so I can quickly fact-check multiple sources for an investigative piece.", { bold: true }),
      para("Acceptance Criteria:"),
      bullet("Pro user can upload a CSV of up to 50 URLs for batch analysis"),
      bullet("Batch results available as downloadable Excel/CSV report within 2 minutes"),
      bullet("Individual verdict, score, and source rating returned for each URL"),
      h2("7.2 Epic: User Authentication"),
      para("US-003: As a new user, I want to register with Google so I can start fact-checking without creating a password.", { bold: true }),
      para("Acceptance Criteria:"),
      bullet("OAuth flow completes in under 5 seconds"),
      bullet("Profile auto-populated from Google account data"),
      bullet("User redirected to onboarding tutorial on first login"),
      bullet("Free tier limits enforced immediately upon account creation"),
      pageBreak(),
      h1("8. Feature Roadmap"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 2160, 3600, 1800],
        rows: [
          new TableRow({ children: [
            ...["Phase", "Timeline", "Key Features", "Milestone"].map(t => new TableCell({ borders, width: { size: t === "Key Features" ? 3600 : t === "Phase" ? 1800 : t === "Timeline" ? 2160 : 1800, type: WidthType.DXA }, shading: { fill: BRAND_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }))
          ]}),
          ...[
            ["Phase 1\nFoundation", "Q3 2026\n(Months 1-3)", "User auth, URL analysis, text analysis, basic dashboard, Supabase setup, Next.js frontend", "Beta Launch"],
            ["Phase 2\nCore ML", "Q4 2026\n(Months 4-6)", "BERT model integration, source credibility DB, browser extension v1, social media analysis", "Public v1.0 Launch"],
            ["Phase 3\nGrowth", "Q1 2027\n(Months 7-9)", "Image analysis, batch processing, API marketplace, community voting, mobile apps", "Pro Tier Launch"],
            ["Phase 4\nEnterprise", "Q2 2027\n(Months 10-12)", "Enterprise dashboard, monitoring alerts, custom ML models, compliance reporting, SLA", "Enterprise Launch"],
            ["Phase 5\nGlobal", "Q3-Q4 2027\n(Months 13-18)", "Multi-language support (15 langs), video analysis, deepfake detection, global CDN", "v2.0 Global"],
          ].map(([phase, timeline, features, milestone]) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: LIGHT_BG, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: phase, bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 2160, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: timeline, size: 18, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 3600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: features, size: 18, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: LIGHT_RED, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: milestone, bold: true, size: 18, font: "Arial", color: BRAND_RED })] })] }),
          ]}))
        ]
      }),
      pageBreak(),
      h1("9. Risk Assessment"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 1560, 1560, 3840],
        rows: [
          new TableRow({ children: [
            ...["Risk", "Probability", "Impact", "Mitigation"].map(t => new TableCell({ borders, shading: { fill: BRAND_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }))
          ]}),
          ...[
            ["Model accuracy below 90%", "Medium", "High", "Continuous model retraining; human-in-the-loop verification; confidence thresholds"],
            ["Legal challenge from media org", "Low", "High", "Legal review; disclaimer language; clear AI-generated label on all verdicts"],
            ["Platform abuse / spam", "High", "Medium", "Rate limiting, CAPTCHA, bot detection, account suspension automation"],
            ["Supabase outage", "Low", "High", "Multi-region deployment; read replicas; failover to backup provider"],
            ["Data privacy breach", "Low", "Critical", "Zero PII in models; encryption at rest/transit; annual penetration testing"],
            ["Competitor launches similar product", "High", "Medium", "Accelerate roadmap; focus on accuracy; build network effects via community"],
          ].map(([risk, prob, impact, mitigation]) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: risk, size: 18, font: "Arial" })] })] }),
            new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, shading: { fill: prob === "High" ? "FDEDEC" : prob === "Low" ? "EAFAF1" : "FEF9E7", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: prob, size: 18, font: "Arial", color: prob === "High" ? BRAND_RED : "000000" })] })] }),
            new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, shading: { fill: impact === "Critical" ? "C0392B" : impact === "High" ? "FDEDEC" : "FEF9E7", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: impact, size: 18, font: "Arial", color: impact === "Critical" ? "FFFFFF" : "000000" })] })] }),
            new TableCell({ borders, width: { size: 3840, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: mitigation, size: 18, font: "Arial" })] })] }),
          ]}))
        ]
      }),
      pageBreak(),
      h1("10. Appendix"),
      h2("10.1 Glossary"),
      bullet("BERT — Bidirectional Encoder Representations from Transformers: an NLP model used for text classification"),
      bullet("RoBERTa — Robustly Optimized BERT Pretraining Approach: an enhanced version of BERT"),
      bullet("NLP — Natural Language Processing"),
      bullet("LIAR Dataset — A benchmark dataset with 12,800+ manually labeled short statements"),
      bullet("PRD — Product Requirements Document"),
      bullet("SLA — Service Level Agreement"),
      bullet("RTO — Recovery Time Objective"),
      bullet("RPO — Recovery Point Objective"),
      bullet("PII — Personally Identifiable Information"),
      h2("10.2 References"),
      bullet("Reuters Institute Digital News Report 2025"),
      bullet("LIAR: A Benchmark Dataset for Fake News Detection (Wang, 2017)"),
      bullet("Supabase Documentation — https://supabase.com/docs"),
      bullet("Next.js Documentation — https://nextjs.org/docs"),
      bullet("OWASP Top 10 — https://owasp.org/top10"),
      bullet("WCAG 2.1 Guidelines — https://www.w3.org/TR/WCAG21"),
      h2("10.3 Document History"),
      infoTable([
        ["Version", "Author"],
        ["v0.1 — Draft", "Product Team — April 2026"],
        ["v0.9 — Review", "Engineering + Design — May 2026"],
        ["v1.0 — Final", "PM, CTO, Legal — June 2026"],
      ]),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("docs/VERIFAI_PRD.docx", buffer);
  console.log("PRD generated successfully!");
});