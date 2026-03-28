import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error:Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Simulate submission (connect to backend endpoint if needed)
    await new Promise(r => setTimeout(r, 1200));
    setStatus('success');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px', alignItems: 'start' }}>

            {/* Info */}
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '8px' }}>Get in Touch</h2>
              <div className="divider" style={{ margin: '12px 0 24px' }} />
              <p style={{ color: '#7a6a5a', lineHeight: 1.8, marginBottom: '36px' }}>
                Whether you have questions about our services, need to speak with a priest, or wish to learn more about our parish, we are always here for you.
              </p>

              {[
                { icon: '📍', title: 'Address', lines: ['1 Church Road, R.S. Puram', 'Coimbatore, Tamil Nadu 641002'] },
                { icon: '📞', title: 'Phone', lines: ['+91 98765 43210', '+91 422 234 5678'] },
                { icon: '✉️', title: 'Email', lines: ['parish@sacredheart.org', 'admin@sacredheart.org'] },
                { icon: '🕐', title: 'Office Hours', lines: ['Mon – Fri: 9:00 AM – 5:00 PM', 'Saturday: 9:00 AM – 12:00 PM'] },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
                  <div style={{
                    width: '44px', height: '44px', background: '#fff8f0', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', flexShrink: 0, border: '1px solid #f0e8d8'
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '13px', color: '#8B1A2C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.title}</p>
                    {item.lines.map(l => <p key={l} style={{ fontSize: '14px', color: '#3d2b1f' }}>{l}</p>)}
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div style={{
                background: 'linear-gradient(135deg, #f5e6c8, #fff8f0)',
                borderRadius: '12px', height: '200px', marginTop: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', border: '1px solid #f0e8d8', gap: '12px'
              }}>
                <span style={{ fontSize: '40px' }}>🗺️</span>
                <p style={{ fontSize: '13px', color: '#a09080' }}>Sacred Heart Parish, R.S. Puram</p>
                <a
                  href="https://maps.google.com/?q=Sacred+Heart+Church+RS+Puram+Coimbatore"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ fontSize: '12px', padding: '8px 18px' }}
                >
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(26,18,8,0.08)' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '28px', color: '#1a1208' }}>
                Send a Message
              </h3>

              {status === 'success' && (
                <div style={{
                  background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '8px',
                  padding: '16px', marginBottom: '24px', color: '#2d7a4f', fontSize: '14px',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  ✅ Thank you! Your message has been sent. We'll get back to you soon.
                </div>
              )}

              {status.startsWith('error:') && (
                <div style={{
                  background: '#ffebee', border: '1px solid #e53935', borderRadius: '8px',
                  padding: '16px', marginBottom: '24px', color: '#c62828', fontSize: '14px'
                }}>
                  ⚠️ {status.replace('error:', '')}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange}>
                      <option value="">Select subject</option>
                      <option>General Inquiry</option>
                      <option>Sacrament Request</option>
                      <option>Event Information</option>
                      <option>Prayer Request</option>
                      <option>Volunteer</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    style={{ minHeight: '140px' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <><span className="loading-spinner" /> Sending...</> : 'Send Message ✝'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section section-alt" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '12px' }}>Need Immediate Help?</h2>
          <p style={{ color: '#7a6a5a', marginBottom: '28px' }}>For emergencies or urgent sacramental needs, please call us directly.</p>
          <a href="tel:+919876543210" className="btn btn-primary">📞 Call Parish Office</a>
        </div>
      </section>
    </div>
  );
}
