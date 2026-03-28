import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/events').then(({ data }) => setEvents(data))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', 'mass', 'feast', 'community', 'sacrament', 'other'];
  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatDateShort = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const isPast = (d) => new Date(d) < new Date();

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Parish Events</h1>
          <p>Stay connected with what's happening in our community</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '8px 20px', borderRadius: '20px', border: 'none',
                background: filter === cat ? '#8B1A2C' : 'white',
                color: filter === cat ? 'white' : '#7a6a5a',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                textTransform: 'capitalize', fontFamily: 'Montserrat, sans-serif',
                boxShadow: '0 2px 8px rgba(26,18,8,0.06)', transition: 'all 0.2s'
              }}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#a09080' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
              <p>Loading events...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📅</div>
              <h3>No Events Found</h3>
              <p>No events in this category yet.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(event => (
                <div key={event._id} className="card" style={{ cursor: 'pointer', opacity: isPast(event.date) ? 0.7 : 1 }} onClick={() => setSelected(event)}>
                  {event.image ? (
                    <img src={event.image} alt={event.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      height: '200px', background: 'linear-gradient(135deg, #8B1A2C, #c0394f)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                    }}>
                      <span style={{ fontSize: '48px' }}>✝</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '8px', letterSpacing: '2px' }}>
                        {formatDateShort(event.date)}
                      </span>
                    </div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{event.category}</span>
                      {isPast(event.date) && <span className="badge" style={{ background: '#f0e8d8', color: '#a09080' }}>Completed</span>}
                    </div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#1a1208', marginBottom: '10px' }}>{event.title}</h3>
                    <p style={{ fontSize: '13px', color: '#a09080', marginBottom: '6px' }}>📅 {formatDate(event.date)}</p>
                    {event.location && <p style={{ fontSize: '13px', color: '#a09080', marginBottom: '12px' }}>📍 {event.location}</p>}
                    <p style={{ fontSize: '13px', color: '#7a6a5a', lineHeight: 1.6 }}>
                      {event.description.slice(0, 120)}{event.description.length > 120 ? '...' : ''}
                    </p>
                    <button style={{
                      marginTop: '16px', background: 'none', border: 'none',
                      color: '#8B1A2C', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', padding: 0,
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      Read more →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Event Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            {selected.image && (
              <img src={selected.image} alt={selected.title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
            )}
            {!selected.image && (
              <div style={{ height: '160px', background: 'linear-gradient(135deg, #8B1A2C, #c0394f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>✝</div>
            )}
            <div className="modal-header">
              <h3>{selected.title}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span className="badge badge-crimson" style={{ textTransform: 'capitalize' }}>{selected.category}</span>
                {isPast(selected.date) && <span className="badge" style={{ background: '#f0e8d8', color: '#a09080' }}>Completed</span>}
              </div>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7a6a5a', fontSize: '14px' }}>
                  <span>📅</span> {formatDate(selected.date)}
                </div>
                {selected.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7a6a5a', fontSize: '14px' }}>
                    <span>📍</span> {selected.location}
                  </div>
                )}
              </div>
              <p style={{ color: '#3d2b1f', lineHeight: 1.8, fontSize: '15px' }}>{selected.description}</p>
              {selected.createdBy && (
                <p style={{ marginTop: '20px', fontSize: '12px', color: '#a09080' }}>
                  Posted by {selected.createdBy.name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
