export default function Parish() {
  const priests = [
    { name: 'Fr. Thomas Mathew', role: 'Parish Priest', exp: '25 years', icon: '👨‍⚖️' },
    { name: 'Fr. Joseph Antony', role: 'Associate Pastor', exp: '12 years', icon: '👨‍⚖️' },
    { name: 'Fr. David Raj', role: 'Assistant Priest', exp: '5 years', icon: '👨‍⚖️' },
    { name: 'Dn. Mark Selvam', role: 'Permanent Deacon', exp: '8 years', icon: '🙏' },
  ];

  const committees = [
    { name: 'Parish Pastoral Council', members: 18, chair: 'Mr. Antony Raj', icon: '⚖️' },
    { name: 'Finance Committee', members: 7, chair: 'Mr. Peter Samy', icon: '💼' },
    { name: 'Liturgy Committee', members: 12, chair: 'Mrs. Mary James', icon: '🕯️' },
    { name: 'Youth Ministry', members: 45, chair: 'Ms. Priya David', icon: '✨' },
    { name: 'Women\'s League', members: 60, chair: 'Mrs. Stella Paul', icon: '🌹' },
    { name: 'Catholic Men\'s Forum', members: 35, chair: 'Mr. John Xavier', icon: '🛡️' },
    { name: 'Catechism Board', members: 20, chair: 'Sr. Agnes Mary', icon: '📖' },
    { name: 'Social Services', members: 25, chair: 'Mr. Samuel Lewis', icon: '🤝' },
  ];

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Our Parish</h1>
          <p>Meet our priests and parish committees</p>
        </div>
      </section>

      {/* Priests */}
      <section id="priests" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Priests</h2>
            <div className="divider" />
            <p>Shepherds of our community</p>
          </div>
          <div className="grid-4">
            {priests.map(p => (
              <div key={p.name} className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B1A2C, #c0394f)',
                  margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
                }}>✝</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#1a1208', marginBottom: '6px' }}>{p.name}</h3>
                <p style={{ fontSize: '12px', color: '#8B1A2C', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.role}</p>
                <p style={{ fontSize: '12px', color: '#a09080' }}>{p.exp} ministry</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committees */}
      <section id="committees" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Parish Committees</h2>
            <div className="divider" />
            <p>Volunteers serving our community</p>
          </div>
          <div className="grid-2">
            {committees.map(c => (
              <div key={c.name} className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '32px', flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#1a1208', marginBottom: '6px' }}>{c.name}</h4>
                  <p style={{ fontSize: '13px', color: '#7a6a5a', marginBottom: '4px' }}>
                    <strong style={{ color: '#1a1208' }}>Chairperson:</strong> {c.chair}
                  </p>
                  <span style={{ fontSize: '12px', color: '#8B1A2C', fontWeight: '600' }}>{c.members} Members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
