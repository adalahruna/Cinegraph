'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthService } from '../../lib/services/auth'
import { AdminService } from '../../lib/services/admin'
import AdminProtection from '../../components/AdminProtection'

function DashboardContent() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        // Check admin authentication
        const { user, profile, error: authError } = await AuthService.getCurrentUser()
        
        if (authError || !user || profile?.role !== 'admin') {
          router.push('/')
          return
        }
        
        setProfile(profile)
        
        // Load dashboard statistics
        const { stats: dashboardStats, error: statsError } = await AdminService.getDashboardStats()
        
        if (statsError) {
          setError(statsError)
        } else {
          setStats(dashboardStats)
        }
        
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeAdmin()
  }, [router])

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?")
    if (confirmLogout) {
      await AuthService.signOut()
      router.push('/')
      router.refresh()
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat dashboard admin...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
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
              <Link
                href="/dashboard/products"
                className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Produk
              </Link>
              <Link
                href="/dashboard/orders"
                className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Pesanan
              </Link>
              <Link
                href="/dashboard/payments"
                className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Pembayaran
              </Link>
              <Link
                href="/dashboard/users"
                className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Pengguna
              </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-purple-500/30 transition-colors duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Pengguna</h3>
            <p className="text-3xl font-bold text-white">{stats?.userCount || 0}</p>
            <span className="text-blue-400 text-xs font-medium">Terdaftar</span>
          </div>
          
          <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-blue-500/30 transition-colors duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Produk Aktif</h3>
            <p className="text-3xl font-bold text-white">{stats?.productCount || 0}</p>
            <span className="text-green-400 text-xs font-medium">Tersedia</span>
          </div>

          <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-purple-500/30 transition-colors duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Pesanan</h3>
            <p className="text-3xl font-bold text-white">{stats?.orderCount || 0}</p>
            <span className="text-yellow-400 text-xs font-medium">Semua status</span>
          </div>

          <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-green-500/30 transition-colors duration-300">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Pendapatan</h3>
            <p className="text-2xl font-bold text-white">{formatPrice(stats?.totalRevenue || 0)}</p>
            <span className="text-green-400 text-xs font-medium">Pesanan selesai</span>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#13141f]/60 backdrop-blur-lg rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Pesanan Terbaru</h3>
              <Link 
                href="/dashboard/orders"
                className="text-sm text-purple-400 hover:text-purple-300 font-medium"
              >
                Lihat Semua →
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        {order.users?.full_name || order.user_id || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-400">{order.users?.email || 'No email'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatPrice(order.total_amount)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-500 text-4xl mb-4">📦</div>
                <p className="text-gray-400">Belum ada pesanan</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            href="/dashboard/products"
            className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-purple-500/30 transition-all duration-300 group"
          >
            <div className="text-purple-400 text-3xl mb-3 group-hover:scale-110 transition-transform">📦</div>
            <h3 className="font-bold text-white mb-2">Kelola Produk</h3>
            <p className="text-gray-400 text-sm">Tambah, edit, atau hapus produk</p>
          </Link>

          <Link 
            href="/dashboard/orders"
            className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-blue-500/30 transition-all duration-300 group"
          >
            <div className="text-blue-400 text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="font-bold text-white mb-2">Kelola Pesanan</h3>
            <p className="text-gray-400 text-sm">Update status dan kelola pesanan</p>
          </Link>

          <Link 
            href="/dashboard/payments"
            className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-yellow-500/30 transition-all duration-300 group"
          >
            <div className="text-yellow-400 text-3xl mb-3 group-hover:scale-110 transition-transform">💳</div>
            <h3 className="font-bold text-white mb-2">Konfirmasi Pembayaran</h3>
            <p className="text-gray-400 text-sm">Review dan konfirmasi pembayaran</p>
          </Link>

          <Link 
            href="/dashboard/users"
            className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5 shadow-lg hover:border-green-500/30 transition-all duration-300 group"
          >
            <div className="text-green-400 text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="font-bold text-white mb-2">Kelola Pengguna</h3>
            <p className="text-gray-400 text-sm">Lihat dan kelola akun pengguna</p>
          </Link>
        </div>
      </main>

    </div>
  )
}

export default function DashboardPage() {
  return (
    <AdminProtection>
      <DashboardContent />
    </AdminProtection>
  )
}