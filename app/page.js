'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(160deg, #16161c 0%, #1c1c24 50%, #18181f 100%)',
      fontFamily: "'DM Sans', sans-serif",
      color: '#e2e2e8',
    }}>

      {/* ── Ambient blobs ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,70,210,0.07) 0%, transparent 70%)',
          top: -150, right: -100, filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(40,130,190,0.06) 0%, transparent 70%)',
          top: 500, left: -80, filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(170,80,120,0.05) 0%, transparent 70%)',
          bottom: 200, right: 60, filter: 'blur(60px)',
        }} />
      </div>

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>

        {/* Ghost text background */}
        <div style={{
          position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Syne', sans-serif", fontSize: 180, fontWeight: 800,
          color: 'rgba(255,255,255,0.025)', letterSpacing: -8, whiteSpace: 'nowrap',
          userSelect: 'none', pointerEvents: 'none', lineHeight: 1,
        }}>
          CineGraph
        </div>

        <div style={{
          background: 'linear-gradient(160deg, rgba(100,60,200,0.1) 0%, rgba(40,100,180,0.06) 40%, transparent 70%)',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 96, paddingBottom: 96 }}>

            {/* Live badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 16px', borderRadius: 40, marginBottom: 28,
              background: 'rgba(167,139,250,0.12)', border: '0.5px solid rgba(167,139,250,0.3)',
              fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
              color: '#c4b5fd', fontWeight: 500,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#a78bfa',
                display: 'inline-block', animation: 'pulse 2s infinite',
              }} />
              Toko Fotografi #1 Indonesia
            </div>

            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(44px, 6vw, 80px)',
              fontWeight: 800, lineHeight: 1.0,
              letterSpacing: -3, marginBottom: 24,
              background: 'linear-gradient(135deg, #e2e2e8 30%, rgba(196,181,253,0.7) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              CineGraph
            </h1>

            <p style={{
              fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 400,
              color: 'rgba(226,226,232,0.65)', marginBottom: 16, maxWidth: 560,
            }}>
              Toko Peralatan Fotografi Terlengkap di Indonesia
            </p>

            <p style={{
              fontSize: 15, lineHeight: 1.75,
              color: 'rgba(226,226,232,0.45)', maxWidth: 480, marginBottom: 40,
            }}>
              Temukan kamera, lensa, tripod, dan aksesoris fotografi berkualitas tinggi
              dengan harga terbaik. Wujudkan passion fotografi Anda bersama kami!
            </p>

            <Link
              href="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', borderRadius: 12,
                background: 'linear-gradient(135deg, #a78bfa, #60b4e8)',
                color: '#fff', fontSize: 15, fontWeight: 600,
                textDecoration: 'none', transition: 'opacity .2s, transform .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.88'
                ;e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1'
                ;e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Lihat Produk
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED CATEGORIES
      ══════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(226,226,232,0.3)', marginBottom: 8 }}>
                Explore
              </p>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(26px, 3vw, 36px)',
                fontWeight: 800, letterSpacing: -1,
                color: '#e2e2e8',
              }}>
                Kategori Produk
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Kamera', icon: '📷', desc: 'DSLR, Mirrorless, Action Cam', accent: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.3)', color: '#c4b5fd' },
              { name: 'Lensa',  icon: '🔍', desc: 'Prime, Zoom, Macro, Telephoto', accent: 'rgba(96,180,232,0.12)', border: 'rgba(96,180,232,0.28)', color: '#93c5fd' },
              { name: 'Tripod', icon: '🎯', desc: 'Carbon, Aluminum, Travel',     accent: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  color: '#6ee7b7' },
              { name: 'Aksesoris', icon: '⚡', desc: 'Flash, Filter, Memory Card', accent: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)',  color: '#fcd34d' },
            ].map((category) => (
              <div key={category.name} style={{
                background: 'rgba(255,255,255,0.035)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 18, padding: '28px 24px',
                display: 'flex', flexDirection: 'column', gap: 0,
                transition: 'transform .25s, border-color .25s, background .25s',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-4px)'
                  el.style.borderColor = category.border
                  el.style.background = 'rgba(255,255,255,0.055)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(0)'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.background = 'rgba(255,255,255,0.035)'
                }}
              >
                {/* Accent glow top */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${category.border}, transparent)`,
                  borderRadius: '18px 18px 0 0',
                }} />

                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: category.accent, border: `0.5px solid ${category.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 18,
                }}>
                  {category.icon}
                </div>

                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 17, fontWeight: 700, marginBottom: 6,
                  color: '#e2e2e8',
                }}>
                  {category.name}
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(226,226,232,0.45)', lineHeight: 1.5, marginBottom: 20, flex: 1 }}>
                  {category.desc}
                </p>
                <Link
                  href={`/products?category=${category.name}`}
                  style={{
                    fontSize: 12.5, fontWeight: 600, color: category.color,
                    textDecoration: 'none', letterSpacing: 0.3,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}
                >
                  Lihat Semua
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        padding: '80px 0',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(226,226,232,0.3)', marginBottom: 8 }}>
                Featured
              </p>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(26px, 3vw, 36px)',
                fontWeight: 800, letterSpacing: -1, color: '#e2e2e8',
              }}>
                Produk Unggulan
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Sony Alpha A7 IV',         price: 'Rp 25.000.000', category: 'Kamera',  icon: '📷', tag: 'Best Seller' },
              { name: 'Canon RF 24-70mm f/2.8L',  price: 'Rp 18.500.000', category: 'Lensa',   icon: '🔍', tag: 'New' },
              { name: 'Manfrotto Carbon Tripod',   price: 'Rp 3.200.000',  category: 'Tripod',  icon: '🎯', tag: null },
            ].map((product, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.035)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 18, overflow: 'hidden',
                transition: 'transform .25s, border-color .25s, background .25s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-4px)'
                  el.style.borderColor = 'rgba(167,139,250,0.3)'
                  el.style.background = 'rgba(255,255,255,0.055)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(0)'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.background = 'rgba(255,255,255,0.035)'
                }}
              >
                {/* Product image area */}
                <div style={{
                  height: 200,
                  background: `linear-gradient(160deg, rgba(${index === 0 ? '110,70,200' : index === 1 ? '40,130,190' : '52,180,120'},0.1) 0%, rgba(30,30,40,0.2) 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                  borderBottom: '0.5px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: 64 }}>{product.icon}</span>
                  {product.tag && (
                    <div style={{
                      position: 'absolute', top: 14, left: 14,
                      padding: '3px 10px', borderRadius: 6, fontSize: 10,
                      fontWeight: 700, letterSpacing: 0.5,
                      background: product.tag === 'New' ? 'rgba(96,180,232,0.15)' : 'rgba(167,139,250,0.15)',
                      border: `0.5px solid ${product.tag === 'New' ? 'rgba(96,180,232,0.3)' : 'rgba(167,139,250,0.3)'}`,
                      color: product.tag === 'New' ? '#93c5fd' : '#c4b5fd',
                    }}>
                      {product.tag}
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div style={{ padding: '22px 22px 24px' }}>
                  <span style={{ fontSize: 10.5, letterSpacing: 1.5, textTransform: 'uppercase', color: '#a78bfa', fontWeight: 600 }}>
                    {product.category}
                  </span>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 16, fontWeight: 700,
                    marginTop: 6, marginBottom: 14,
                    color: '#e2e2e8', lineHeight: 1.25,
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 20, fontWeight: 800,
                    marginBottom: 18,
                    background: 'linear-gradient(90deg, #c4b5fd, #93c5fd)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    {product.price}
                  </p>
                  <button style={{
                    width: '100%', padding: '11px 0', borderRadius: 10,
                    background: 'rgba(167,139,250,0.12)',
                    border: '0.5px solid rgba(167,139,250,0.3)',
                    color: '#c4b5fd', fontSize: 13.5, fontWeight: 600,
                    cursor: 'pointer', transition: 'all .2s',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.background = 'rgba(167,139,250,0.22)'
                      el.style.borderColor = 'rgba(167,139,250,0.5)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.background = 'rgba(167,139,250,0.12)'
                      el.style.borderColor = 'rgba(167,139,250,0.3)'
                    }}
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link
              href="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 12,
                background: 'transparent',
                border: '0.5px solid rgba(255,255,255,0.18)',
                color: 'rgba(226,226,232,0.7)', fontSize: 14, fontWeight: 500,
                textDecoration: 'none', transition: 'all .2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(167,139,250,0.4)'
                el.style.color = '#c4b5fd'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(255,255,255,0.18)'
                el.style.color = 'rgba(226,226,232,0.7)'
              }}
            >
              Lihat Semua Produk
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div style={{ marginBottom: 52, textAlign: 'center' }}>
            <p style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(226,226,232,0.3)', marginBottom: 10 }}>
              Keunggulan
            </p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(26px, 3vw, 36px)',
              fontWeight: 800, letterSpacing: -1, color: '#e2e2e8',
            }}>
              Mengapa Pilih CineGraph?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '✅',
                title: 'Produk Original',
                desc: 'Semua produk dijamin 100% original dengan garansi resmi',
                accent: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', color: '#6ee7b7',
              },
              {
                icon: '🚚',
                title: 'Pengiriman Cepat',
                desc: 'Pengiriman ke seluruh Indonesia dengan packaging aman',
                accent: 'rgba(96,180,232,0.1)', border: 'rgba(96,180,232,0.25)', color: '#93c5fd',
              },
              {
                icon: '💬',
                title: 'Customer Support',
                desc: 'Tim support yang siap membantu 24/7 via WhatsApp',
                accent: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', color: '#c4b5fd',
              },
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 18, padding: '36px 28px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center',
                transition: 'transform .25s, border-color .25s',
                cursor: 'default', position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-3px)'
                  el.style.borderColor = feature.border
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(0)'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${feature.border}, transparent)`,
                  borderRadius: '18px 18px 0 0',
                }} />

                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: feature.accent, border: `0.5px solid ${feature.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, marginBottom: 20,
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 17, fontWeight: 700, marginBottom: 10, color: '#e2e2e8',
                }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 13.5, color: 'rgba(226,226,232,0.45)', lineHeight: 1.65 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>

    </div>
  )
}