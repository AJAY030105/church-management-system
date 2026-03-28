import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  useEffect(() => { if (user) navigate(user.role === 'admin' ? '/admin' : '/'); }, [user]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      if (!form.name || !form.email || !form.password) return setError('All fields are required.');
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
      if (form.password !== form.confirm) return setError('Passwords do not match.');
      const res = await register(form.name, form.email, form.password);
      if (!res.success) setError(res.message);
    } else {
      if (!form.email || !form.password) return setError('Please enter email and password.');
      const res = await login(form.email, form.password);
      if (!res.success) setError(res.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #6B1220 0%, #8B1A2C 50%, #4a0d1a 100%)',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div style={{
        width: '100%', maxWidth: '440px', position: 'relative', zIndex: 2,
        animation: 'fadeIn 0.5s ease'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', background: 'rgba(201,168,76,0.15)',
            borderRadius: '50%', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(201,168,76,0.4)', fontSize: '28px', color: '#C9A84C'
          }}>✝</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#FDF6E9', marginBottom: '4px' }}>
            Sacred Heart Parish
          </h1>
          <p style={{ color: 'rgba(253,246,233,0.6)', fontSize: '13px' }}>
            {isRegister ? 'Create your parish account' : 'Welcome back, parishioner'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: '32px', background: '#f5f0ea', borderRadius: '10px', padding: '4px' }}>
            {['Login', 'Register'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setIsRegister(i === 1); setError(''); setForm({ name: '', email: '', password: '', confirm: '' }); }}
                style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
                  background: isRegister === (i === 1) ? '#8B1A2C' : 'transparent',
                  color: isRegister === (i === 1) ? 'white' : '#7a6a5a',
                  fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              background: '#ffebee', border: '1px solid #e53935', borderRadius: '8px',
              padding: '12px 16px', marginBottom: '20px', color: '#c62828', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" autoFocus />
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" autoFocus={!isRegister} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder={isRegister ? 'Minimum 6 characters' : 'Your password'} />
            </div>
            {isRegister && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Re-enter password" />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '14px', padding: '14px' }}
              disabled={loading}
            >
              {loading
                ? <><span className="loading-spinner" /> {isRegister ? 'Creating Account...' : 'Signing In...'}</>
                : isRegister ? 'Create Account ✝' : 'Sign In ✝'
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#a09080', marginTop: '24px' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#8B1A2C', fontWeight: '600', cursor: 'pointer', fontSize: '12px', fontFamily: 'Montserrat, sans-serif' }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'rgba(253,246,233,0.5)' }}>
          <Link to="/" style={{ color: 'rgba(201,168,76,0.8)', textDecoration: 'none' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
