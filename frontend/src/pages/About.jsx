export default function About() {
  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>Our history, faith, and community</p>
        </div>
      </section>

      {/* History */}
      <section id="history" className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <h2>Our History</h2>
                <div className="divider" style={{ margin: '12px 0' }} />
              </div>
              <p style={{ color: '#7a6a5a', lineHeight: 1.9, marginBottom: '16px' }}>
                Sacred Heart Parish was established in 1897 by the Diocese of Coimbatore, founded to serve the growing Catholic community in the region. The original chapel, a modest structure, stood at the center of the then-small settlement.
              </p>
              <p style={{ color: '#7a6a5a', lineHeight: 1.9, marginBottom: '16px' }}>
                Over the decades, the parish grew alongside the city. In 1952, the current church building was consecrated — a magnificent structure blending Gothic and traditional Indian architectural elements, with beautiful stained-glass windows depicting the life of Christ.
              </p>
              <p style={{ color: '#7a6a5a', lineHeight: 1.9 }}>
                Today, Sacred Heart Parish is home to over 3,200 families, with a vibrant community of faith that serves the spiritual, educational, and social needs of its members and the broader community.
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #8B1A2C, #4a0d1a)', borderRadius: '16px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
              ⛪
            </div>
          </div>
        </div>
      </section>

      {/* Patron Saint */}
      <section id="patron" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Our Patron Saint</h2>
            <div className="divider" />
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>❤️‍🔥</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#8B1A2C', marginBottom: '20px' }}>The Sacred Heart of Jesus</h3>
            <p style={{ color: '#7a6a5a', lineHeight: 1.9, marginBottom: '20px' }}>
              The Sacred Heart of Jesus is a beloved devotion in the Catholic Church, representing Christ's divine love for humanity. The image of the Sacred Heart — depicting Jesus with a flaming heart surrounded by a crown of thorns — symbolizes His infinite mercy and compassion.
            </p>
            <p style={{ color: '#7a6a5a', lineHeight: 1.9 }}>
              Our parish feast day is celebrated on the Friday following the second Sunday after Pentecost. It is a day of special prayer, Mass, and community gathering as we honour the love of our patron.
            </p>
            <div style={{ marginTop: '32px', padding: '24px', background: '#fff8f0', borderRadius: '12px', borderLeft: '4px solid #C9A84C' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.2rem', color: '#8B1A2C' }}>
                "Come to me, all you who are weary and burdened, and I will give you rest." — Matthew 11:28
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parish Info */}
      <section id="info" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Parish Information</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {[
              { icon: '📍', title: 'Address', lines: ['1 Church Road', 'R.S. Puram, Coimbatore', 'Tamil Nadu 641002'] },
              { icon: '📞', title: 'Contact', lines: ['+91 98765 43210', '+91 422 234 5678', 'parish@sacredheart.org'] },
              { icon: '🕰️', title: 'Office Hours', lines: ['Mon–Fri: 9 AM – 5 PM', 'Saturday: 9 AM – 12 PM', 'Sunday: After Mass'] },
              { icon: '🏛️', title: 'Diocese', lines: ['Diocese of Coimbatore', 'Bishop: Most Rev. Name', 'Est. 1953'] },
              { icon: '✝', title: 'Affiliation', lines: ['Roman Catholic', 'Latin Rite', 'Tamil Nadu RC Bishops'] },
              { icon: '👥', title: 'Community', lines: ['3,200+ Families', '12 Active Ministries', 'Parish School Attached'] },
            ].map(item => (
              <div key={item.title} className="card" style={{ padding: '28px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '12px', color: '#1a1208' }}>{item.title}</h4>
                {item.lines.map(l => <p key={l} style={{ fontSize: '13px', color: '#7a6a5a', marginBottom: '4px' }}>{l}</p>)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
