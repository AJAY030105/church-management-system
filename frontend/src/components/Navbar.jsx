import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const DROPDOWNS = {
  about: [
    { label: 'Our History', path: '/about#history' },
    { label: 'Patron Saint', path: '/about#patron' },
    { label: 'Parish Info', path: '/about#info' },
  ],
  parish: [
    { label: 'Our Priests', path: '/parish#priests' },
    { label: 'Committees', path: '/parish#committees' },
  ],
  services: [
    { label: 'Mass Timings', path: '/services#mass' },
    { label: 'Sacraments', path: '/services#sacraments' },
    { label: 'Ministries', path: '/services#ministries' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [location]);

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
    transition: 'all 0.3s ease',
    background: scrolled ? 'rgba(253,246,233,0.97)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    boxShadow: scrolled ? '0 2px 20px rgba(26,18,8,0.1)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(201,168,76,0.2)' : 'none',
  };

  const isHomePage = location.pathname === '/';
  const textColor = (!scrolled && isHomePage) ? 'white' : '#1a1208';

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', background: '#8B1A2C',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C9A84C', fontSize: '18px', fontWeight: '700', flexShrink: 0
          }}>✝</div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: '700', color: textColor, lineHeight: 1 }}>Sacred Heart</div>
            <div style={{ fontSize: '9px', letterSpacing: '2px', color: textColor === 'white' ? 'rgba(255,255,255,0.7)' : '#a09080', textTransform: 'uppercase' }}>Parish</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div ref={dropRef} style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {[
            { label: 'Home', path: '/' },
            { label: 'About', key: 'about' },
            { label: 'Parish', key: 'parish' },
            { label: 'Events', path: '/events' },
            { label: 'Services', key: 'services' },
            { label: 'Gallery', path: '/gallery' },
            { label: 'Learning Hub', path: '/learning' },
            { label: 'Contact', path: '/contact' },
          ].map((item) => (
            <div key={item.label} style={{ position: 'relative' }}>
              {item.path ? (
                <Link to={item.path} style={{
                  padding: '8px 12px', borderRadius: '6px', fontSize: '13px',
                  fontWeight: isActive(item.path) ? '600' : '500',
                  color: isActive(item.path) ? '#8B1A2C' : textColor,
                  background: isActive(item.path) ? 'rgba(139,26,44,0.08)' : 'transparent',
                  transition: 'all 0.2s', display: 'block',
                  textDecoration: 'none',
                }}>
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                    style={{
                      padding: '8px 12px', borderRadius: '6px', fontSize: '13px',
                      fontWeight: '500', color: textColor, background: 'transparent',
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                      fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s'
                    }}
                  >
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: openDropdown === item.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openDropdown === item.key && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                      background: 'white', borderRadius: '10px', minWidth: '180px',
                      boxShadow: '0 8px 30px rgba(26,18,8,0.15)', border: '1px solid #f0e8d8',
                      overflow: 'hidden', zIndex: 9999
                    }}>
                      {DROPDOWNS[item.key].map(link => (
                        <Link key={link.path} to={link.path} style={{
                          display: 'block', padding: '11px 18px', fontSize: '13px',
                          color: '#1a1208', transition: 'background 0.2s',
                          borderBottom: '1px solid #f8f4ee', textDecoration: 'none',
                        }}
                          onMouseEnter={e => e.target.style.background = '#fff8f0'}
                          onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} ref={dropRef}>
          <div style={{ color: textColor }}>
            <NotificationBell />
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                background: user ? '#8B1A2C' : 'transparent',
                border: user ? 'none' : `2px solid ${textColor}`,
                color: user ? 'white' : textColor,
                width: '36px', height: '36px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif'
              }}
            >
              {user ? user.name.charAt(0).toUpperCase() : '👤'}
            </button>
            {profileOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                background: 'white', borderRadius: '10px', minWidth: '180px',
                boxShadow: '0 8px 30px rgba(26,18,8,0.15)', border: '1px solid #f0e8d8',
                overflow: 'hidden', zIndex: 9999
              }}>
                {user ? (
                  <>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0e8d8' }}>
                      <p style={{ fontWeight: '600', fontSize: '13px', color: '#1a1208' }}>{user.name}</p>
                      <p style={{ fontSize: '11px', color: '#a09080' }}>{user.role}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" style={{ display: 'block', padding: '11px 18px', fontSize: '13px', color: '#8B1A2C', fontWeight: '600', textDecoration: 'none' }}
                        onMouseEnter={e => e.target.style.background = '#fff8f0'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { logout(); navigate('/'); setProfileOpen(false); }} style={{
                      display: 'block', width: '100%', padding: '11px 18px', fontSize: '13px',
                      color: '#e53935', background: 'transparent', border: 'none',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif'
                    }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" style={{ display: 'block', padding: '11px 18px', fontSize: '13px', color: '#1a1208', textDecoration: 'none' }}>
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: textColor, display: 'none' }}
            className="mobile-menu-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #f0e8d8', padding: '16px 24px 24px' }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'About', path: '/about' },
            { label: 'Parish', path: '/parish' },
            { label: 'Events', path: '/events' },
            { label: 'Services', path: '/services' },
            { label: 'Gallery', path: '/gallery' },
            { label: 'Learning Hub', path: '/learning' },
            { label: 'Contact', path: '/contact' },
          ].map(item => (
            <Link key={item.path} to={item.path} style={{
              display: 'block', padding: '12px 0', fontSize: '14px', color: '#1a1208',
              borderBottom: '1px solid #f8f4ee', textDecoration: 'none', fontWeight: '500'
            }}>
              {item.label}
            </Link>
          ))}
          {!user && <Link to="/login" style={{ display: 'block', marginTop: '16px', padding: '12px 20px', background: '#8B1A2C', color: 'white', borderRadius: '8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Login</Link>}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } }
      `}</style>
    </nav>
  );
}
