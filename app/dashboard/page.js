'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../../lib/services/auth'

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { user, profile, error } = await AuthService.getCurrentUser()
      
      if (error || !user || profile?.role !== 'admin') {
        router.push('/')
        return
      }
      
      setProfile(profile)
      setIsLoading(false)
    }
    
    checkAdmin()
  }, [router])

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?")
    if (confirmLogout) {
      await AuthService.signOut()
      router.push('/')
      router.refresh()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans relative overflow-hidden">
      
      {/* Background Gradient & Glow Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Navbar Dashboard */}
      <nav className="relative z-10 border-b border-white/10 bg-[#13141f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                CineGraph Admin
              </h1>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-white">{profile?.full_name}</span>
                  <span className="text-xs text-gray-500">{profile?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in-down">
          <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang, {profile?.full_name?.split(' ')[0]}!</h2>
          <p className="text-gray-400">Berikut adalah ringkasan data CineGraph hari ini.</p>
        </div>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-purple-500/30 transition-colors duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Pengguna</h3>
            <p className="text-3xl font-bold text-white">1,248</p>
            <span className="text-green-400 text-xs font-medium">+12% dari bulan lalu</span>
          </div>
          
          <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-blue-500/30 transition-colors duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Produk Aktif</h3>
            <p className="text-3xl font-bold text-white">42</p>
            <span className="text-green-400 text-xs font-medium">+3 produk baru minggu ini</span>
          </div>

          <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-purple-500/30 transition-colors duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Pesanan</h3>
            <p className="text-3xl font-bold text-white">89</p>
            <span className="text-green-400 text-xs font-medium">+15% dari minggu lalu</span>
          </div>
        </div>

        {/* Dashboard Area */}
        <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed border-gray-600 rounded-full mx-auto mb-4 animate-spin-slow"></div>
            <p className="text-gray-500 font-medium">Panel Admin Aktif. Anda masuk sebagai {profile?.role}.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-6 text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4"
            >
              Kembali ke Beranda Utama
            </button>
          </div>
        </div>
      </main>

    </div>
  )
}