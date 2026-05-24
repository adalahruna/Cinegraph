export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        .footer-link {
          font-size: 13.5px;
          color: rgba(226,226,232,0.45);
          text-decoration: none;
          transition: color .2s;
          font-family: 'DM Sans', sans-serif;
        }
        .footer-link:hover { color: #e2e2e8; }
      `}</style>

      <footer style={{
        background: 'rgba(16,16,20,0.95)',
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '56px 24px 0' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Brand */}
            <div>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20, fontWeight: 800, letterSpacing: -0.5,
                background: 'linear-gradient(90deg, #c4b5fd, #93c5fd)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                display: 'block', marginBottom: 14,
              }}>
                CineGraph
              </span>
              <p style={{
                fontSize: 13.5, lineHeight: 1.75,
                color: 'rgba(226,226,232,0.4)', maxWidth: 260,
              }}>
                Toko online peralatan fotografi terlengkap di Indonesia.
                Menyediakan kamera, lensa, dan aksesoris berkualitas tinggi.
              </p>
            </div>

            {/* Kategori */}
            <div>
              <p style={{
                fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                color: 'rgba(226,226,232,0.28)', fontWeight: 500, marginBottom: 18,
              }}>
                Kategori
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Kamera', 'Lensa', 'Tripod', 'Aksesoris'].map(item => (
                  <li key={item}>
                    <a href="#" className="footer-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <p style={{
                fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                color: 'rgba(226,226,232,0.28)', fontWeight: 500, marginBottom: 18,
              }}>
                Kontak
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: '✉', text: 'info@cinegraph.com' },
                  { icon: '📞', text: '+62 21 1234 5678' },
                  { icon: '💬', text: '+62 812 3456 7890' },
                ].map((item) => (
                  <li key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(255,255,255,0.05)',
                      border: '0.5px solid rgba(255,255,255,0.09)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13,
                    }}>{item.icon}</span>
                    <span style={{ fontSize: 13.5, color: 'rgba(226,226,232,0.45)' }}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '0.5px solid rgba(255,255,255,0.07)',
            marginTop: 48, padding: '20px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}>
            <p style={{ fontSize: 12, color: 'rgba(226,226,232,0.25)', margin: 0 }}>
              © 2024 CineGraph. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy Policy', 'Terms of Use'].map(item => (
                <a key={item} href="#" className="footer-link" style={{ fontSize: 12 }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}