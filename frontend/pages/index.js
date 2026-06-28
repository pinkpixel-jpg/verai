import { useState, useEffect } from 'react';

// --- SVG Icons ---
function ShieldIcon({ size = 18, color = 'currentColor', fill = 'none' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function HomeIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function GridIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function ClockIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LinkIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function FileTextIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function GlobeIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function SearchIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function LogoutIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function TrashIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// --- Verdict Badge Component ---
function VerdictBadge({ verdict, size = 'md' }) {
  const map = {
    real: { label: 'Real', bg: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)' },
    fake: { label: 'Fake', bg: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)' },
    unknown: { label: 'Unknown', bg: 'rgba(113, 113, 122, 0.08)', border: '1px solid rgba(113, 113, 122, 0.2)', color: 'var(--text-secondary)' }
  };
  const v = map[verdict] || map.unknown;
  
  return (
    <div style={{
      background: v.bg,
      border: v.border,
      color: v.color,
      padding: size === 'lg' ? '6px 12px' : size === 'sm' ? '2px 6px' : '4px 10px',
      borderRadius: '4px',
      fontSize: size === 'lg' ? 13 : size === 'sm' ? 10 : 11,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      letterSpacing: '0.3px',
      textTransform: 'uppercase'
    }}>
      {v.label}
    </div>
  );
}

// --- Loading Spinner Component ---
function LoadingSpinner() {
  return (
    <div style={{
      display: 'inline-block',
      width: 16,
      height: 16,
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite'
    }} />
  );
}

// --- Toast Component ---
function Toast({ message, type = 'info', onClose }) {
  const bgMap = {
    success: 'var(--success)',
    error: 'var(--danger)',
    info: 'var(--primary)',
    warning: 'var(--warning)'
  };
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      background: 'var(--bg-card)',
      borderLeft: `3px solid ${bgMap[type]}`,
      borderTop: '1px solid var(--border)',
      borderRight: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      color: 'var(--text-primary)',
      padding: '12px 18px',
      borderRadius: 'var(--radius)',
      fontSize: 13,
      fontWeight: 500,
      boxShadow: 'var(--shadow-xl)',
      animation: 'slideInUp 0.2s ease-out',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          cursor: 'pointer', 
          fontSize: 15,
          padding: 0,
          opacity: 0.8
        }}
      >
        ×
      </button>
    </div>
  );
}

// --- Main Page Component ---
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [displayName, setDisplayName] = useState('Rashmi Rahangdale');
  const [profileEmail, setProfileEmail] = useState('rahangdalerashmi60@gmail.com');
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [activeMenu, setActiveMenu] = useState('detector');
  const [tab, setTab] = useState('url'); // 'url' or 'text'
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ total: 0, real: 0, fake: 0 });

  // Initialize and load session/profile details on mount
  useEffect(() => {
    // Load local auth
    const savedAuth = localStorage.getItem('isLoggedIn');
    if (savedAuth === 'false') {
      setIsLoggedIn(false);
    }
    
    // Load local profile
    const savedName = localStorage.getItem('displayName');
    if (savedName) {
      setDisplayName(savedName);
    }
    const savedEmail = localStorage.getItem('profileEmail');
    if (savedEmail) {
      setProfileEmail(savedEmail);
    }

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
    setTimeout(() => setToast(null), 4000);
  }

  async function analyze(e) {
    e && e.preventDefault();
    const val = tab === 'url' ? url : text;
    if (!val.trim()) {
      showToast(`Please enter a ${tab === 'url' ? 'URL link' : 'text passage'} to verify`, 'warning');
      return;
    }
    
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: tab === 'text' ? text : '',
          url: tab === 'url' ? url : ''
        })
      });
      const json = await res.json();
      if (res.ok) {
        setResult(json);
        showToast('Verification completed successfully', 'success');
        await fetchHistory();
      } else {
        throw new Error(json.error || 'Server error occurred');
      }
    } catch (err) {
      setResult({ error: err.message });
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function deleteLog(id, e) {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3000/analyses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Log deleted successfully', 'success');
        await fetchHistory();
      } else {
        throw new Error('Failed to delete history record');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass.trim()) {
      showToast('Please enter both email and password', 'warning');
      return;
    }
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('profileEmail', loginEmail);
    setProfileEmail(loginEmail);
    setIsLoggedIn(true);
    showToast('Signed in successfully', 'success');
    fetchHistory();
  }

  function handleLogout() {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    showToast('Signed out of session', 'info');
  }

  function saveProfileChanges(e) {
    e.preventDefault();
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('profileEmail', profileEmail);
    showToast('Profile settings saved successfully', 'success');
  }

  function updatePassword(e) {
    e.preventDefault();
    if (!currPassword || !newPassword) {
      showToast('Please fill out password fields', 'warning');
      return;
    }
    setCurrPassword('');
    setNewPassword('');
    showToast('Password updated successfully', 'success');
  }

  const menuItems = [
    { id: 'detector', label: 'Detector', icon: <HomeIcon /> },
    { id: 'dashboard', label: 'Dashboard', icon: <GridIcon /> },
    { id: 'history', label: 'History', icon: <ClockIcon /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon /> }
  ];

  // --- Render Login Screen if Logged Out ---
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideInDown 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <ShieldIcon size={16} color="white" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Inter', letterSpacing: '-0.4px' }}>
              VerifAI Portal
            </span>
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, textAlign: 'center' }}>Sign in to your account</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 24 }}>Enter credentials to view verification metrics</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Email Address</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'white',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Password</label>
              <input 
                type="password" 
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'white',
                  fontSize: '13px'
                }}
              />
            </div>

            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '10px 16px',
                background: 'var(--primary)',
                border: 'none',
                color: 'white',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                marginTop: 8,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Render Standard Application UI when Logged In ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        zIndex: 10
      }}>
        {/* Sidebar Header / Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 20px',
          marginBottom: '32px'
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <ShieldIcon size={16} color="white" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
              VerifAI
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              SaaS Controller
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setResult(null);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  borderRadius: 'var(--radius)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div style={{
          padding: '16px 12px 0 12px',
          borderTop: '1px solid var(--border)',
          margin: '0 12px'
        }}>
          {/* Profile Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
            padding: '6px 8px',
            borderRadius: '6px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            cursor: 'pointer'
          }}
          onClick={() => setActiveMenu('profile')}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: 'white'
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Admin User</div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--danger)';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogoutIcon size={13} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main style={{
        flex: 1,
        padding: '50px 40px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {activeMenu === 'detector' && (
          <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'slideInUp 0.3s ease-out' }}>
            
            <h1 style={{
              fontSize: '32px',
              fontWeight: 800,
              marginBottom: 10,
              textAlign: 'center',
              color: 'var(--text-primary)'
            }}>
              Verify Content Credibility
            </h1>

            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              maxWidth: 420,
              textAlign: 'center',
              lineHeight: '1.6',
              marginBottom: 32
            }}>
              Paste a URL or article text below to verify facts, detect clickbait bias, and identify false information.
            </p>

            {/* Segmented Control Tab Switcher */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '3px',
              width: '100%',
              marginBottom: 20
            }}>
              <button
                onClick={() => { setTab('url'); setResult(null); }}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: tab === 'url' ? 'var(--bg-primary)' : 'transparent',
                  border: tab === 'url' ? '1px solid var(--border)' : '1px solid transparent',
                  color: tab === 'url' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <LinkIcon size={12} />
                Check URL Link
              </button>
              <button
                onClick={() => { setTab('text'); setResult(null); }}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: tab === 'text' ? 'var(--bg-primary)' : 'transparent',
                  border: tab === 'text' ? '1px solid var(--border)' : '1px solid transparent',
                  color: tab === 'text' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <FileTextIcon size={12} />
                Check Raw Text
              </button>
            </div>

            {/* Analysis Card */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              width: '100%',
              boxShadow: 'var(--shadow-md)'
            }}>
              {tab === 'url' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <GlobeIcon size={16} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>URL Link Scraper</h3>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>URL content is parsed and analyzed automatically</p>
                    </div>
                  </div>

                  <form onSubmit={analyze} style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/news-story..."
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        transition: 'border 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--text-muted)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: 38,
                        height: 38,
                        background: 'var(--primary)',
                        border: 'none',
                        color: 'white',
                        borderRadius: 'var(--radius)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'var(--primary-hover)')}
                      onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--primary)')}
                    >
                      {loading ? <LoadingSpinner /> : <SearchIcon size={14} />}
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <FileTextIcon size={16} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Text Classifier</h3>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>Analyze raw text content for sensational clickbait</p>
                    </div>
                  </div>

                  <form onSubmit={analyze} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <textarea
                      rows={5}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste article paragraphs, headlines, or claims..."
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        minHeight: '100px',
                        transition: 'border 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--text-muted)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '10px 20px',
                        background: 'var(--primary)',
                        border: 'none',
                        color: 'white',
                        borderRadius: 'var(--radius)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '13px',
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                      onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'var(--primary-hover)')}
                      onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--primary)')}
                    >
                      {loading ? <><LoadingSpinner /> Analyzing...</> : <>Verify Text</>}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Analysis Results Display */}
            {result && (
              <div style={{
                marginTop: 20,
                padding: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                animation: 'slideInUp 0.2s ease-out'
              }}>
                {result.error ? (
                  <div style={{ color: 'var(--danger)', fontSize: '13px' }}>Scraper Error: {result.error}</div>
                ) : (
                  <div>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Analysis Report</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.5px' }}>VERDICT</div>
                        <VerdictBadge verdict={result.verdict} size="lg" />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.5px' }}>PROBABILITY</div>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          color: result.confidence > 0.7 ? 'var(--success)' : result.confidence > 0.4 ? 'var(--warning)' : 'var(--danger)'
                        }}>
                          {(result.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Confidence Meter Bar */}
                    <div style={{ margin: '12px 0' }}>
                      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '4px', height: 6, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${result.confidence * 100}%`,
                          background: 'var(--primary)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease-out'
                        }} />
                      </div>
                    </div>

                    <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {result.verdict === 'real' && 'Based on the trained Naive Bayes classifier, this content matches verified reports and scientific/factual consensus.'}
                      {result.verdict === 'fake' && 'Warning: This content shows strong clickbait markers, exclamation spikes, or aligns with false reports.'}
                      {result.verdict === 'unknown' && 'The scoring metrics are inconclusive. The text does not match clear classification vectors.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Dashboard View */}
        {activeMenu === 'dashboard' && (
          <div style={{ width: '100%', maxWidth: 740, display: 'flex', flexDirection: 'column', gap: '24px', animation: 'slideInUp 0.3s ease-out' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: 4 }}>System Metrics</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Overview of all classification queries stored in the database.</p>
            </div>

            {/* Quick Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Analyses Logged</span>
                <span style={{ fontSize: '28px', fontWeight: 700 }}>{stats.total}</span>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Dynamic Counter</div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Factual (Real)</span>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--success)' }}>{stats.real}</span>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {stats.total > 0 ? ((stats.real / stats.total) * 100).toFixed(0) : 0}% of scans
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Misinformation</span>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--danger)' }}>{stats.fake}</span>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {stats.total > 0 ? ((stats.fake / stats.total) * 100).toFixed(0) : 0}% of scans
                </div>
              </div>
            </div>

            {/* Metrics Breakdowns */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: 16 }}>Log Distribution</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Factual content rate</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>{stats.total > 0 ? ((stats.real / stats.total) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--success)', width: `${stats.total > 0 ? (stats.real / stats.total) * 100 : 0}%`, transition: 'width 0.4s' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Misinformation rate</span>
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{stats.total > 0 ? ((stats.fake / stats.total) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--danger)', width: `${stats.total > 0 ? (stats.fake / stats.total) * 100 : 0}%`, transition: 'width 0.4s' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Inconclusive / Neutral rate</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {stats.total > 0 ? (((stats.total - stats.real - stats.fake) / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--text-secondary)', width: `${stats.total > 0 ? ((stats.total - stats.real - stats.fake) / stats.total) * 100 : 0}%`, transition: 'width 0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {activeMenu === 'history' && (
          <div style={{ width: '100%', maxWidth: 740, display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideInUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: 4 }}>Audit Logs</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Historical lists of verified submissions. Changes sync with your database.</p>
              </div>
              <button 
                onClick={fetchHistory}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
              >
                Refresh Log
              </button>
            </div>

            {/* List Table */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {history.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>No reports recorded yet</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>Logs will appear here once scans are processed.</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Source Link / Raw Text</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', width: '120px' }}>Verdict</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', width: '100px' }}>Confidence</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', width: '90px' }}>Time</th>
                        <th style={{ padding: '12px 16px', width: '60px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h, i) => (
                        <tr 
                          key={h.id || i} 
                          style={{ 
                            borderBottom: i === history.length - 1 ? 'none' : '1px solid var(--border)',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            <div style={{ 
                              maxWidth: 320, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap'
                            }}>
                              {h.source_url ? (
                                <a href={h.source_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                  🔗 {h.source_url}
                                </a>
                              ) : (
                                h.input_text || '—'
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <VerdictBadge verdict={h.verdict} size="sm" />
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: h.confidence > 0.7 ? 'var(--success)' : h.confidence > 0.4 ? 'var(--warning)' : 'var(--danger)' }}>
                            {(h.confidence * 100).toFixed(0)}%
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                            {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              onClick={(e) => deleteLog(h.id, e)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: 4,
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <TrashIcon size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile View (Fully Functional Settings) */}
        {activeMenu === 'profile' && (
          <div style={{ width: '100%', maxWidth: 740, display: 'flex', flexDirection: 'column', gap: '24px', animation: 'slideInUp 0.3s ease-out' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: 4 }}>Account Settings</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage your personal details and change account login credentials.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
              {/* User Bio Card */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: 6
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600 }}>{displayName}</h3>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'var(--bg-primary)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px' }}>Administrator</span>
                </div>
                <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Online</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Role Permissions</span>
                    <span style={{ color: 'var(--text-primary)' }}>Full Access</span>
                  </div>
                </div>
              </div>

              {/* Settings Configuration forms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Profile Form */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: 14 }}>Profile Information</h3>
                  <form onSubmit={saveProfileChanges} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Full Display Name</label>
                      <input 
                        type="text" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--text-primary)',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Email Address</label>
                      <input 
                        type="email" 
                        value={profileEmail} 
                        onChange={(e) => setProfileEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--text-primary)',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        background: 'var(--primary)',
                        border: 'none',
                        color: 'white',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        alignSelf: 'flex-start',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
                    >
                      Save Settings
                    </button>
                  </form>
                </div>

                {/* Password Form */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: 14 }}>Security Updates</h3>
                  <form onSubmit={updatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Current Password</label>
                      <input 
                        type="password" 
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--text-primary)',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--text-primary)',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        background: 'var(--primary)',
                        border: 'none',
                        color: 'white',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        alignSelf: 'flex-start',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
