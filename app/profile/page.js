'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthService } from '../../lib/services/auth'
import { OrderService } from '../../lib/services/orders'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { user, profile } = await AuthService.getCurrentUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setProfile(profile)
      setLoading(false)
    }

    checkUser()
  }, [router])

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return
      
      setOrdersLoading(true)
      const { orders, error } = await OrderService.getUserOrders({ limit: 20 })
      if (!error) {
        setOrders(orders)
      }
      setOrdersLoading(false)
    }

    if (user) {
      loadOrders()
    }
  }, [user])

  const handleLogout = async () => {
    await AuthService.signOut()
    router.push('/')
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'awaiting_payment':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
      case 'confirmed':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
      case 'shipped':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
      case 'delivered':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      case 'cancelled':
        return 'bg-red-500/10 border-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Pembayaran'
      case 'awaiting_payment':
        return 'Menunggu Konfirmasi'
      case 'confirmed':
        return 'Dikonfirmasi'
      case 'shipped':
        return 'Dikirim'
      case 'delivered':
        return 'Selesai'
      case 'cancelled':
        return 'Dibatalkan'
      default:
        return status
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'pending':
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400'
      case 'uploaded':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'confirmed':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      case 'rejected':
        return 'bg-red-500/10 border-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400'
    }
  }

  const getPaymentStatusText = (paymentStatus) => {
    switch (paymentStatus) {
      case 'pending':
        return 'Belum Bayar'
      case 'uploaded':
        return 'Menunggu Verifikasi'
      case 'confirmed':
        return 'Pembayaran Dikonfirmasi'
      case 'rejected':
        return 'Pembayaran Ditolak'
      default:
        return paymentStatus
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full"></div>
        </div>
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          <p className="text-gray-400 font-medium tracking-wide animate-pulse">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans relative overflow-hidden">
      
      {/* Background Gradient & Glow Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Large Faint Watermark Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.02] pointer-events-none select-none overflow-hidden w-full text-center fixed">
        <h1 className="text-[12vw] font-black tracking-tighter whitespace-nowrap">PROFILE</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-3 pb-1">
            Profil Saya
          </h1>
          <p className="text-gray-400 text-lg">Kelola akun dan lihat riwayat pesanan Anda</p>
        </div>

        {/* Tabs */}
        <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden mb-8">
          <div className="border-b border-white/10 bg-white/[0.02]">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'profile', label: 'Profil', icon: '👤' },
                { id: 'orders', label: 'Riwayat Pesanan', icon: '📦' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-5 px-8 text-sm font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'border-purple-500 text-purple-400 bg-white/[0.03]' 
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 sm:p-10">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* User Info */}
                  <div className="bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span>👤</span>
                      Informasi Akun
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <p className="text-white bg-[#13141f] border border-white/10 rounded-lg px-3 py-2">
                          {user?.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nama Lengkap</label>
                        <p className="text-white bg-[#13141f] border border-white/10 rounded-lg px-3 py-2">
                          {profile?.full_name || 'Belum diisi'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nomor Telepon</label>
                        <p className="text-white bg-[#13141f] border border-white/10 rounded-lg px-3 py-2">
                          {profile?.phone || 'Belum diisi'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                          profile?.role === 'admin' 
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                          {profile?.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span>⚙️</span>
                      Aksi Akun
                    </h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-bold text-gray-300 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-gray-500 transition-all duration-300">
                        <span>✏️</span>
                        Edit Profil
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-bold text-gray-300 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-gray-500 transition-all duration-300">
                        <span>🔒</span>
                        Ubah Password
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-red-500/20 rounded-xl shadow-sm text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-red-500 transition-all duration-300"
                      >
                        <span>🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📦</span>
                    Riwayat Pesanan
                  </h3>
                  <span className="text-sm text-gray-400 bg-[#13141f] border border-white/10 px-3 py-1 rounded-full">
                    {orders.length} Pesanan
                  </span>
                </div>

                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Memuat riwayat pesanan...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-50">📦</div>
                    <h3 className="text-xl font-bold text-white mb-2">Belum Ada Pesanan</h3>
                    <p className="text-gray-400 mb-6">Anda belum pernah melakukan pemesanan</p>
                    <Link 
                      href="/products"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-400 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300"
                    >
                      Mulai Belanja
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                        
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">
                              Pesanan #{order.id.slice(0, 8)}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-md text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                {formatPrice(order.total_amount)}
                              </span>
                            </div>
                            {order.payment_status && (
                              <span className={`px-3 py-1 rounded-md text-xs font-medium border ${getPaymentStatusColor(order.payment_status)}`}>
                                💳 {getPaymentStatusText(order.payment_status)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-[#13141f]/50 rounded-lg">
                              <div className="w-12 h-12 bg-[#0a0a0f] border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-500 text-xl">📷</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-white truncate">
                                  {item.products?.name || 'Produk Tidak Ditemukan'}
                                </h5>
                                <p className="text-sm text-gray-400">
                                  {item.quantity}x • {formatPrice(item.unit_price)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-300">
                                  {formatPrice(item.total_price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}