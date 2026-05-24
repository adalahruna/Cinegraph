'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../lib/services/auth'
import { supabase } from '../lib/supabase' // 🔥 FIX

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { user, profile } = await AuthService.getCurrentUser()
      setUser(user)
      setProfile(profile)
      setIsLoading(false)
    }

    checkUser()

    // 🔥 FIX: pakai supabase langsung
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { user, profile } = await AuthService.getCurrentUser()
        setUser(user)
        setProfile(profile)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await AuthService.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        .nav-link {
          font-size: 13.5px;
          font-weight: 400;
          color: rgba(226,226,232,0.55);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color .2s, background .2s;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-link:hover {
          color: #e2e2e8;
          background: rgba(255,255,255,0.06);
        }
        .nav-link-mobile {
          display: block;
          font-size: 15px;
          font-weight: 400;
          color: rgba(226,226,232,0.6);
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 10px;
          transition: color .2s, background .2s;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-link-mobile:hover {
          color: #e2e2e8;
          background: rgba(255,255,255,0.06);
        }
        .btn-login {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 10px;
          background: linear-gradient(135deg, #a78bfa, #60b4e8);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: opacity .2s, transform .15s;
          font-family: 'DM Sans', sans-serif;
          border: none;
          cursor: pointer;
        }
        .btn-login:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }
        .btn-logout {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 0.5px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background .2s, transform .15s;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
        }
        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
        }
        .btn-login-mobile {
          display: block;
          padding: 12px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(167,139,250,0.2), rgba(96,180,232,0.15));
          border: 0.5px solid rgba(167,139,250,0.35);
          color: #c4b5fd;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: background .2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-login-mobile:hover {
          background: linear-gradient(135deg, rgba(167,139,250,0.3), rgba(96,180,232,0.22));
        }
        .hamburger {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(226,226,232,0.65);
          transition: background .2s, color .2s;
        }
      `}</style>

      {/* 🔥 UI KAMU TIDAK DIUBAH */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(22,22,28,0.75)',
        backdropFilter: 'blur(24px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
      }}>
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

            <Link href="/">
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                background: 'linear-gradient(90deg, #c4b5fd, #93c5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                CineGraph
              </span>
            </Link>

            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 4 }}>
  <Link href="/" className="nav-link">Home</Link>
  <Link href="/products" className="nav-link">Products</Link>

  {/* 🔥 CART BALIK */}
  <Link href="/cart" className="nav-link">
    Cart
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 6,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'rgba(167,139,250,0.2)',
      border: '0.5px solid rgba(167,139,250,0.35)',
      fontSize: 10,
      fontWeight: 700,
      color: '#c4b5fd',
    }}>
      0
    </span>
  </Link>

  <Link href="/profile" className="nav-link">Profile</Link>

  {profile?.role === 'admin' && (
    <Link
      href="/dashboard"
      className="nav-link"
      style={{ color: '#a78bfa', fontWeight: '600' }}
    >
      Dashboard
    </Link>
  )}
</div>

            <div className="hidden md:flex">
              {!isLoading && (
                user ? (
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                ) : (
                  <Link href="/login" className="btn-login">Login</Link>
                )
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}