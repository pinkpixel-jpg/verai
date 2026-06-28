const express = require('express');
const cors = require('cors');

const app = express();

// Secure CORS configuration: Restrict in production
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? (process.env.FRONTEND_URL || 'http://localhost:3002')
  : '*';

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'verai-backend' });
});

const db = require('./db');

// initialize DB
db.init();

// Simple analyze endpoint: call ML service (mock) and persist result
app.post('/analyze', async (req, res) => {
  const { text, url } = req.body || {};

  // For now, call local ML mock service
  let verdict = 'unknown';
  let confidence = 0.0;
  try {
    const fetchFn = (typeof globalThis.fetch === 'function') ? globalThis.fetch : require('node-fetch');
    const mlRes = await fetchFn(process.env.ML_URL || 'http://localhost:8001/infer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, url })
    });
    const mlJson = await mlRes.json();
    console.log('ML Service Response:', mlJson);
    verdict = mlJson.verdict || verdict;
    confidence = typeof mlJson.confidence === 'number' ? mlJson.confidence : confidence;
  } catch (err) {
    // ML call failed — continue with default unknown verdict
    console.warn('ML service call failed:', err.message);
  }

  // persist
  const rec = await db.insertAnalysis({ source_url: url, input_text: text, verdict, confidence });

  res.json({ id: rec.id, verdict, confidence });
});

app.get('/analyses', async (req, res) => {
  const list = await db.getRecentAnalyses(50);
  res.json({ count: list.length, analyses: list });
});

app.delete('/analyses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.deleteAnalysis(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`verai-backend listening on ${PORT}`));
