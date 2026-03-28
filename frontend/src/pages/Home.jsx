import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(({ data }) => {
      setEvents(data.slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ paddingTop: 0 }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #6B1220 0%, #8B1A2C 40%, #4a0d1a 100%)',
        overflow: 'hidden', textAlign: 'center'
      }}>
        {/* Pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.06'%3E%3Cpath d='M40 0v80M0 40h80'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(74,13,26,0.6) 100%)'
        }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '0 24px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>✝</span>
            <span style={{ fontSize: '11px', letterSpacing: '4px', color: '#C9A84C', textTransform: 'uppercase', fontWeight: '600' }}>
              Welcome to Our Parish
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: '700',
            color: '#FDF6E9', lineHeight: 1.1, marginBottom: '24px'
          }}>
            Sacred Heart<br />
            <em style={{ color: '#C9A84C' }}>Parish Church</em>
          </h1>
          <p style={{ color: 'rgba(253,246,233,0.8)', fontSize: '16px', lineHeight: 1.8, marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px' }}>
            A community of faith, hope, and love — gathered in the name of Jesus Christ. Join us in worship, fellowship, and service.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/events" style={{
              padding: '14px 32px', background: '#C9A84C', color: '#1a1208',
              borderRadius: '8px', fontWeight: '700', fontSize: '14px',
              textDecoration: 'none', letterSpacing: '0.5px', transition: 'all 0.3s'
            }}>
              View Events
            </Link>
            <Link to="/services" style={{
              padding: '14px 32px', background: 'transparent',
              border: '2px solid rgba(253,246,233,0.5)', color: '#FDF6E9',
              borderRadius: '8px', fontWeight: '600', fontSize: '14px',
              textDecoration: 'none', letterSpacing: '0.5px'
            }}>
              Mass Timings
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: '24px', height: '40px', border: '2px solid rgba(201,168,76,0.5)', borderRadius: '12px', display: 'flex', justifyContent: 'center', paddingTop: '6px' }}>
            <div style={{ width: '4px', height: '8px', background: '#C9A84C', borderRadius: '2px', animation: 'scrollBounce 1.5s ease infinite' }} />
          </div>
        </div>
        <style>{`@keyframes scrollBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }`}</style>
      </section>

      {/* Announcements strip */}
      <section style={{ background: '#C9A84C', padding: '16px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', overflow: 'hidden' }}>
            <span style={{ background: '#8B1A2C', color: 'white', padding: '4px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
              ANNOUNCEMENTS
            </span>
            <p style={{ fontSize: '13px', color: '#1a1208', fontWeight: '500' }}>
              ✝ Sunday Mass: 7:00 AM, 9:00 AM, 11:00 AM &nbsp;•&nbsp; Confession: Saturday 5:30–6:30 PM &nbsp;•&nbsp; Youth Group: Every Friday 6 PM
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {[
              { num: '1897', label: 'Founded', icon: '🏛️' },
              { num: '3,200+', label: 'Parish Families', icon: '👨‍👩‍👧‍👦' },
              { num: '12', label: 'Ministries', icon: '✝' },
              { num: '52+', label: 'Annual Events', icon: '📅' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '32px 20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: '700', color: '#8B1A2C', lineHeight: 1 }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '13px', color: '#a09080', marginTop: '8px', fontWeight: '500', letterSpacing: '0.5px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section style={{ padding: '80px 0', background: '#FDF6E9' }}>
        <div className="container">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <div className="divider" />
            <p>Join us for worship, fellowship, and celebration</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#a09080' }}>Loading events...</div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📅</div>
              <h3>No Upcoming Events</h3>
              <p>Check back soon for upcoming parish events.</p>
            </div>
          ) : (
            <div className="grid-3" style={{ marginBottom: '48px' }}>
              {events.map(event => (
                <div key={event._id} className="card" style={{ padding: '0' }}>
                  {event.image ? (
                    <img src={event.image} alt={event.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '180px', background: 'linear-gradient(135deg, #8B1A2C, #c0394f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>✝</div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <span className="badge badge-gold" style={{ marginBottom: '12px' }}>{event.category}</span>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', marginBottom: '8px', color: '#1a1208' }}>{event.title}</h3>
                    <p style={{ fontSize: '13px', color: '#a09080', marginBottom: '8px' }}>📅 {formatDate(event.date)}</p>
                    {event.location && <p style={{ fontSize: '13px', color: '#a09080' }}>📍 {event.location}</p>}
                    <p style={{ fontSize: '13px', color: '#7a6a5a', marginTop: '12px', lineHeight: 1.6 }}>{event.description.slice(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Link to="/events" className="btn btn-primary">View All Events</Link>
          </div>
        </div>
      </section>

      {/* Services quick */}
      <section style={{ padding: '80px 0', background: '#8B1A2C' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '48px' }}>
            <h2 style={{ color: '#FDF6E9' }}>Parish Services</h2>
            <div className="divider" />
          </div>
          <div className="grid-4">
            {[
              { icon: '🕯️', title: 'Daily Mass', desc: 'Mon–Sat 6:30 AM' },
              { icon: '💒', title: 'Confession', desc: 'Sat 5:30–6:30 PM' },
              { icon: '🙏', title: 'Adoration', desc: 'First Friday 7 PM' },
              { icon: '✝', title: 'Sacraments', desc: 'By Appointment' },
            ].map(s => (
              <div key={s.title} style={{ background: 'rgba(253,246,233,0.08)', borderRadius: '12px', padding: '28px 24px', textAlign: 'center', border: '1px solid rgba(201,168,76,0.2)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{s.icon}</div>
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#FDF6E9', marginBottom: '6px' }}>{s.title}</h4>
                <p style={{ fontSize: '13px', color: 'rgba(253,246,233,0.6)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '16px' }}>Grow in Faith with Us</h2>
          <div className="divider" style={{ margin: '0 auto 20px' }} />
          <p style={{ color: '#7a6a5a', maxWidth: '500px', margin: '0 auto 36px', fontSize: '15px', lineHeight: 1.8 }}>
            Explore our Learning Hub — take scripture quizzes, deepen your knowledge of the faith, and connect with our community.
          </p>
          <Link to="/learning" className="btn btn-primary" style={{ marginRight: '16px' }}>Start Learning</Link>
          <Link to="/contact" className="btn btn-secondary">Get in Touch</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1208', color: 'rgba(253,246,233,0.7)', padding: '60px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px', color: '#C9A84C' }}>✝</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#FDF6E9' }}>Sacred Heart Parish</span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.8 }}>A community of faith, hope, and love since 1897.</p>
            </div>
            <div>
              <h4 style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Quick Links</h4>
              {['Events', 'Services', 'Gallery', 'Contact'].map(l => (
                <Link key={l} to={`/${l.toLowerCase()}`} style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'rgba(253,246,233,0.7)', textDecoration: 'none' }}>{l}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Contact</h4>
              <p style={{ fontSize: '13px', lineHeight: 2 }}>
                📍 1 Church Road, Coimbatore<br />
                📞 +91 98765 43210<br />
                ✉️ parish@sacredheart.org<br />
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(253,246,233,0.1)', paddingTop: '24px', textAlign: 'center', fontSize: '12px' }}>
            © {new Date().getFullYear()} Sacred Heart Parish. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
