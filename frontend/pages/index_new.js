import { useState, useEffect } from 'react';

function VerdictBadge({ verdict, size = 'md' }) {
  const map = {
    real: { label: '✓ Real', bg: 'var(--success)', icon: '🟢' },
    fake: { label: '✗ Fake', bg: 'var(--danger)', icon: '🔴' },
    unknown: { label: '? Unknown', bg: 'var(--bg-tertiary)', icon: '⚪' }
  };
  const v = map[verdict] || map.unknown;
  const sizeMap = { sm: 10, md: 12, lg: 14 };
  return (
    <div style={{
      background: v.bg,
      color: 'white',
      padding: size === 'lg' ? '12px 16px' : size === 'sm' ? '4px 8px' : '8px 12px',
      borderRadius: 'var(--radius)',
      fontSize: sizeMap[size],
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 0.3s ease',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <span style={{ fontSize: size === 'lg' ? 18 : 14 }}>{v.icon}</span>
      {v.label}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      display: 'inline-block',
      width: 18,
      height: 18,
      border: '3px solid var(--bg-tertiary)',
      borderTop: '3px solid var(--accent)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  );
}

function Toast({ message, type = 'info' }) {
  const bgMap = {
    success: 'var(--success)',
    error: 'var(--danger)',
    info: 'var(--primary-light)',
    warning: 'var(--warning)'
  };
  return (
    <div style={{
      background: bgMap[type],
      color: 'white',
      padding: '12px 16px',
      borderRadius: 'var(--radius)',
      marginBottom: 12,
      fontSize: 14,
      boxShadow: 'var(--shadow-lg)',
      animation: 'slideInDown 0.3s ease-out'
    }}>
      {message}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState('url');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ total: 0, real: 0, fake: 0 });
  const [activeMenu, setActiveMenu] = useState('detector');

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch('http://localhost:3000/analyses');
      const j = await res.json();
      const analyses = j.analyses || [];
      setHistory(analyses);
      const real = analyses.filter(a => a.verdict === 'real').length;
      const fake = analyses.filter(a => a.verdict === 'fake').length;
      setStats({ total: analyses.length, real, fake });
    } catch (err) {
      showToast('Failed to load history', 'error');
    }
  }

  function showToast(msg, type = 'info') {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function analyze(e) {
    e && e.preventDefault();
    if (!text.trim() && !url.trim()) {
      showToast('Please enter content to analyze', 'warning');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tab === 'text' ? text : '', url: tab === 'url' ? url : '' })
      });
      const json = await res.json();
      setResult(json);
      showToast('Analysis complete!', 'success');
      await fetchHistory();
    } catch (err) {
      setResult({ error: err.message });
      showToast('Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  const menuItems = [
    { id: 'detector', label: 'Detector', icon: '🎯' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'history', label: 'History', icon: '⏰' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 320,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 24px',
          marginBottom: 32,
          animation: 'slideInLeft 0.5s ease-out'
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            🔍 VERIFAI
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Content Detector
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, paddingBottom: 32 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: activeMenu === item.id ? 'rgba(20, 184, 166, 0.15)' : 'transparent',
                border: 'none',
                borderLeft: activeMenu === item.id ? '3px solid var(--accent)' : '3px solid transparent',
                color: activeMenu === item.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textAlign: 'left'
              }}
              onMouseEnter={(e) => activeMenu !== item.id && (e.target.style.color = 'var(--text-primary)', e.target.style.background = 'rgba(20, 184, 166, 0.08)')}
              onMouseLeave={(e) => activeMenu !== item.id && (e.target.style.color = 'var(--text-secondary)', e.target.style.background = 'transparent')}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div style={{
          padding: '0 24px',
          borderTop: '1px solid var(--border)',
          paddingTop: 20
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
            padding: 12,
            borderRadius: 'var(--radius)',
            background: 'rgba(20, 184, 166, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(20, 184, 166, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(20, 184, 166, 0.1)'}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: 'white'
            }}>
              R
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                rashangdale@gmail.com
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Admin</div>
            </div>
          </div>

          <button style={{
            width: '100%',
            padding: '10px 12px',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
          onMouseEnter={(e) => (e.target.style.background = 'var(--border)', e.target.style.color = 'var(--danger)')}
          onMouseLeave={(e) => (e.target.style.background = 'transparent', e.target.style.color = 'var(--text-secondary)')}
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflow: 'auto' }}>
        {toast && <Toast message={toast.message} type={toast.type} />}

        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: 48,
            paddingTop: 20
          }}>
            <div style={{
              fontSize: 56,
              fontWeight: 700,
              marginBottom: 12,
              background: 'linear-gradient(135deg, white 0%, var(--accent-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Fake News Detector
            </div>
            <p style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              maxWidth: 600,
              margin: '0 auto'
            }}>
              Paste a URL or article text and let AI analyze it for credibility, bias, and misinformation.
            </p>
          </div>

          {/* Tab Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 32
          }}>
            <button
              onClick={() => { setTab('url'); setResult(null); }}
              style={{
                padding: '16px 24px',
                background: tab === 'url' ? 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)' : 'var(--bg-secondary)',
                border: tab === 'url' ? 'none' : '1px solid var(--border)',
                color: 'white',
                borderRadius: 'var(--radius)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: tab === 'url' ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => tab !== 'url' && (e.target.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => tab !== 'url' && (e.target.style.borderColor = 'var(--border)')}
            >
              🔗 Check URL
            </button>
            <button
              onClick={() => { setTab('text'); setResult(null); }}
              style={{
                padding: '16px 24px',
                background: tab === 'text' ? 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)' : 'var(--bg-secondary)',
                border: tab === 'text' ? 'none' : '1px solid var(--border)',
                color: 'white',
                borderRadius: 'var(--radius)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: tab === 'text' ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => tab !== 'text' && (e.target.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => tab !== 'text' && (e.target.style.borderColor = 'var(--border)')}
            >
              📝 Check Text
            </button>
          </div>

          {/* Active Tab Content */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 32,
            boxShadow: 'var(--shadow-md)',
            marginBottom: 32,
            animation: 'slideInUp 0.4s ease-out'
          }}>
            {tab === 'url' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 24 }}>🌐</div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 700 }}>URL Analysis</h3>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Paste a news article link to verify</p>
                  </div>
                </div>
                <form onSubmit={analyze} style={{ display: 'flex', gap: 12 }}>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article..."
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '14px 24px',
                      background: loading ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: 'var(--radius)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      opacity: loading ? 0.6 : 1,
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    {loading ? <><LoadingSpinner /></> : <>🔍</>}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 24 }}>📄</div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 700 }}>Text Analysis</h3>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Paste article content to verify</p>
                  </div>
                </div>
                <form onSubmit={analyze} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <textarea
                    rows={8}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste article text here..."
                    style={{
                      padding: '14px 16px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      background: loading ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: 'var(--radius)',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      opacity: loading ? 0.6 : 1,
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    {loading ? <><LoadingSpinner /> Analyzing...</> : <>🔍 Analyze</>}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Result */}
          {result && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(3, 102, 214, 0.1) 100%)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 32,
              animation: 'slideInUp 0.4s ease-out'
            }}>
              {result.error ? (
                <div style={{ color: 'var(--danger)', fontSize: 14 }}>❌ Error: {result.error}</div>
              ) : (
                <div>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 700 }}>Analysis Result</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                        Verdict
                      </div>
                      <VerdictBadge verdict={result.verdict} size="lg" />
                      <p style={{ margin: '16px 0 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>
                        {result.verdict === 'real' && 'This content appears to be credible and authentic.'}
                        {result.verdict === 'fake' && 'This content shows signs of misinformation or credibility issues.'}
                        {result.verdict === 'unknown' && 'The credibility of this content could not be determined.'}
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                        Confidence Score
                      </div>
                      <div style={{
                        fontSize: 48,
                        fontWeight: 700,
                        color: result.confidence > 0.7 ? 'var(--success)' : result.confidence > 0.4 ? 'var(--warning)' : 'var(--danger)',
                        marginBottom: 12
                      }}>
                        {(result.confidence * 100).toFixed(0)}%
                      </div>
                      <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', height: 8, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${result.confidence * 100}%`,
                          background: `linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%)`,
                          transition: 'width 0.6s ease-out'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
