export default function Services() {
  const massTimes = [
    { day: 'Monday – Saturday', times: ['6:30 AM (Daily Mass)', '7:00 PM (Evening Mass)'], note: 'Except public holidays' },
    { day: 'Sunday', times: ['7:00 AM', '9:00 AM', '11:00 AM', '6:30 PM'], note: 'All in English & Tamil' },
    { day: 'First Friday', times: ['6:30 AM', '7:00 PM (Adoration + Mass)'], note: 'Sacred Heart devotion' },
    { day: 'Feast Days', times: ['Special schedule'], note: 'See announcements' },
  ];

  const sacraments = [
    { name: 'Baptism', icon: '💧', desc: 'Baptism of infants every second Sunday after 11 AM Mass. Registration one month in advance required.', contact: 'Parish Office' },
    { name: 'Holy Eucharist', icon: '🍞', desc: 'First Holy Communion preparation for children aged 7+. Classes begin in January.', contact: 'Catechism Office' },
    { name: 'Confirmation', icon: '🕊️', desc: 'Confirmation preparation for youth aged 14+. Year-long program.', contact: 'Youth Ministry' },
    { name: 'Matrimony', icon: '💒', desc: 'Marriage preparation course required. Register at least 6 months in advance.', contact: 'Parish Office' },
    { name: 'Confession', icon: '🙏', desc: 'Every Saturday 5:30 PM – 6:30 PM. By appointment during weekdays.', contact: 'Parish Priest' },
    { name: 'Anointing of the Sick', icon: '🕯️', desc: 'Available upon request for the sick and elderly. Contact the parish for home visits.', contact: 'Parish Office' },
  ];

  const ministries = [
    { name: 'Choir Ministry', icon: '🎵', desc: 'Leads music at all Sunday Masses. Welcomes singers and musicians.' },
    { name: 'Altar Servers', icon: '⛪', desc: 'Boys and girls aged 10–18 serving at the altar during Mass.' },
    { name: 'Lectors Ministry', icon: '📖', desc: 'Proclaiming the Word of God at Mass. Training provided.' },
    { name: 'Extraordinary Ministers', icon: '🍷', desc: 'Distribution of Holy Communion. Certification required.' },
    { name: 'Rosary Sodality', icon: '📿', desc: 'Daily rosary at 6:00 AM. Monthly novenas and pilgrimages.' },
    { name: 'St. Vincent de Paul', icon: '🤝', desc: 'Social outreach, food drives, and support for the poor.' },
    { name: 'RCIA', icon: '✝', desc: 'Rite of Christian Initiation for Adults. Inquiry sessions year-round.' },
    { name: 'Prayer Group', icon: '🕊️', desc: 'Charismatic prayer meetings every Thursday at 7 PM.' },
  ];

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Parish Services</h1>
          <p>Mass timings, sacraments, and active ministries</p>
        </div>
      </section>

      {/* Mass Timings */}
      <section id="mass" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Mass Timings</h2>
            <div className="divider" />
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {massTimes.map((m, i) => (
              <div key={i} className="card" style={{ padding: '24px 28px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', background: '#8B1A2C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: '18px', flexShrink: 0 }}>
                  🕐
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#1a1208', marginBottom: '8px' }}>{m.day}</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {m.times.map(t => (
                      <span key={t} style={{ background: '#fff8f0', border: '1px solid #f0e8d8', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', color: '#8B1A2C', fontWeight: '600' }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: '#a09080' }}>📝 {m.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacraments */}
      <section id="sacraments" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Sacraments</h2>
            <div className="divider" />
            <p>The seven sacraments of the Catholic Church</p>
          </div>
          <div className="grid-3">
            {sacraments.map(s => (
              <div key={s.name} className="card" style={{ padding: '28px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#1a1208', marginBottom: '10px' }}>{s.name}</h3>
                <p style={{ fontSize: '13px', color: '#7a6a5a', lineHeight: 1.7, marginBottom: '12px' }}>{s.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8B1A2C', fontWeight: '600' }}>
                  📞 Contact: {s.contact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section id="ministries" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Ministries</h2>
            <div className="divider" />
            <p>Ways to serve and grow in your faith</p>
          </div>
          <div className="grid-4">
            {ministries.map(m => (
              <div key={m.name} className="card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{m.icon}</div>
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#1a1208', marginBottom: '8px' }}>{m.name}</h4>
                <p style={{ fontSize: '12px', color: '#7a6a5a', lineHeight: 1.7 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
