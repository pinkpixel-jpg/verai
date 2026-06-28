const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const DB_FILE = process.env.VERAI_DB_FILE || path.join(__dirname, 'verai_store.json');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-project-url')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Successfully initialized Supabase Client for:', supabaseUrl);
  } catch (err) {
    console.error('Failed to initialize Supabase Client:', err.message);
  }
} else {
  console.warn('Warning: SUPABASE_URL and SUPABASE_KEY are not configured. Falling back to local file storage.');
}

// --- JSON File Database Fallback Functions ---
function _read() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { analyses: [] };
  }
}

function _write(obj) {
  fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

function init() {
  if (!supabase) {
    const exists = fs.existsSync(DB_FILE);
    if (!exists) {
      _write({ analyses: [] });
    }
  }
}

// --- Dynamic Query Functions ---
async function insertAnalysis({ source_url, input_text, verdict, confidence }) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .insert([
          {
            source_url: source_url || null,
            input_text: input_text || null,
            verdict: verdict || null,
            confidence: typeof confidence === 'number' ? confidence : 0.0
          }
        ])
        .select();

      if (error) {
        throw error;
      }
      return { id: data && data[0] ? data[0].id : 1 };
    } catch (err) {
      console.error('Supabase write operation failed. Falling back to local store. Error:', err.message);
    }
  }

  // Fallback
  const db = _read();
  const id = (db.analyses.length > 0) ? db.analyses[db.analyses.length - 1].id + 1 : 1;
  const rec = {
    id,
    created_at: new Date().toISOString(),
    source_url: source_url || null,
    input_text: input_text || null,
    verdict: verdict || null,
    confidence: typeof confidence === 'number' ? confidence : 0.0
  };
  db.analyses.push(rec);
  _write(db);
  return { id };
}

async function getRecentAnalyses(limit = 20) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }
      
      // Map Supabase objects (ensure dates match fields)
      return (data || []).map(row => ({
        id: row.id,
        created_at: row.created_at,
        source_url: row.source_url,
        input_text: row.input_text,
        verdict: row.verdict,
        confidence: row.confidence
      }));
    } catch (err) {
      console.error('Supabase select operation failed. Falling back to local store. Error:', err.message);
    }
  }

  // Fallback
  const db = _read();
  return db.analyses.slice(-limit).reverse();
}

async function deleteAnalysis(id) {
  const numericId = parseInt(id, 10);
  if (supabase) {
    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', numericId);

      if (error) {
        throw error;
      }
      return { success: true };
    } catch (err) {
      console.error('Supabase delete operation failed. Falling back to local store. Error:', err.message);
    }
  }

  // Fallback
  const db = _read();
  db.analyses = db.analyses.filter(a => a.id !== numericId);
  _write(db);
  return { success: true };
}

module.exports = { init, insertAnalysis, getRecentAnalyses, deleteAnalysis, DB_FILE };
