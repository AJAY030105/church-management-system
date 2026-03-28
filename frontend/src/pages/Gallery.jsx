import { useState } from 'react';

const GALLERY_ITEMS = [
  { id: 1, title: 'Christmas Midnight Mass', category: 'liturgy', emoji: '✝', color: '#8B1A2C' },
  { id: 2, title: 'Easter Vigil', category: 'liturgy', emoji: '🕯️', color: '#c0394f' },
  { id: 3, title: 'Parish Feast Day', category: 'feast', emoji: '🎊', color: '#C9A84C' },
  { id: 4, title: 'First Holy Communion', category: 'sacrament', emoji: '🍞', color: '#4a7c59' },
  { id: 5, title: 'Confirmation Class', category: 'sacrament', emoji: '🕊️', color: '#3d5a80' },
  { id: 6, title: 'Youth Group Gathering', category: 'community', emoji: '✨', color: '#7b2d8b' },
  { id: 7, title: 'Charity Food Drive', category: 'community', emoji: '🤝', color: '#d4472a' },
  { id: 8, title: 'Choir Performance', category: 'liturgy', emoji: '🎵', color: '#8B1A2C' },
  { id: 9, title: 'Baptism Ceremony', category: 'sacrament', emoji: '💧', color: '#1a6b8b' },
  { id: 10, title: 'Parish Picnic', category: 'community', emoji: '☀️', color: '#b5803b' },
  { id: 11, title: 'Advent Procession', category: 'liturgy', emoji: '🕯️', color: '#6B1220' },
  { id: 12, title: 'Marriage Blessing', category: 'sacrament', emoji: '💒', color: '#c0394f' },
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const categories = ['all', 'liturgy', 'sacrament', 'feast', 'community'];
  const filtered = filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.category === filter);

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Gallery</h1>
          <p>Moments of faith, community, and celebration</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter */}
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

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {filtered.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setLightbox(item)}
                style={{
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  position: 'relative', aspectRatio: i % 5 === 0 ? '1/1.3' : '1/1',
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  boxShadow: '0 2px 12px rgba(26,18,8,0.12)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(26,18,8,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,18,8,0.12)'; }}
              >
                <span style={{ fontSize: '48px', marginBottom: '12px' }}>{item.emoji}</span>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                  padding: '32px 16px 16px', textAlign: 'center'
                }}>
                  <p style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{item.title}</p>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize', letterSpacing: '1px' }}>{item.category}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: '#a09080', fontSize: '13px', marginTop: '40px' }}>
            * Gallery images are placeholder representations. Real images can be added via the admin dashboard.
          </p>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-overlay" onClick={() => setLightbox(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: '16px', overflow: 'hidden',
            maxWidth: '500px', width: '100%', textAlign: 'center'
          }}>
            <div style={{
              height: '300px', background: `linear-gradient(135deg, ${lightbox.color}, ${lightbox.color}cc)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px'
            }}>
              {lightbox.emoji}
            </div>
            <div style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', marginBottom: '8px' }}>{lightbox.title}</h3>
              <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{lightbox.category}</span>
              <button onClick={() => setLightbox(null)} className="btn btn-primary" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
