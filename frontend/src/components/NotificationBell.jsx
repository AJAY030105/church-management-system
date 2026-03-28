import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);

  const unread = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  const typeIcon = (type) => ({ event: '📅', announcement: '📢', quiz: '📝', general: '🔔' }[type] || '🔔');

  return (
    <div style={{ position: 'relative' }} ref={dropRef}>
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          position: 'relative', padding: '8px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
          color: 'inherit'
        }}
        title="Notifications"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '4px', right: '4px',
            background: '#e53935', color: 'white',
            width: '18px', height: '18px', borderRadius: '50%',
            fontSize: '10px', fontWeight: '700',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid white'
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 12px)',
          width: '340px', background: 'white', borderRadius: '12px',
          boxShadow: '0 8px 40px rgba(26,18,8,0.18)',
          border: '1px solid #f0e8d8', zIndex: 9999,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #f0e8d8',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#8B1A2C'
          }}>
            <span style={{ fontWeight: '600', color: 'white', fontSize: '14px' }}>
              Notifications {unread > 0 && `(${unread} new)`}
            </span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none',
                color: 'white', fontSize: '11px', cursor: 'pointer',
                padding: '4px 10px', borderRadius: '12px', fontFamily: 'inherit'
              }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {loading && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Loading...</div>
            )}
            {!loading && notifications.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
                <p style={{ fontSize: '13px' }}>No notifications yet</p>
              </div>
            )}
            {!loading && notifications.map(n => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markRead(n._id)}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f8f4ee',
                  background: n.isRead ? 'white' : '#fff8f0',
                  cursor: n.isRead ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex', gap: '12px', alignItems: 'flex-start'
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{typeIcon(n.type)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', color: '#1a1208', lineHeight: '1.5', marginBottom: '4px' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '11px', color: '#a09080' }}>{formatTime(n.createdAt)}</span>
                </div>
                {!n.isRead && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B1A2C', flexShrink: 0, marginTop: '4px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
