'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtection from '../../../components/AdminProtection'

function OrdersManagementContent() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

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

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Gagal memuat pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'awaiting_payment', label: 'Menunggu Pembayaran' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'delivered', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat pesanan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-[#13141f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                CineGraph Admin
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-white font-medium">Kelola Pesanan</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Kelola Pesanan</h1>
            <p className="text-gray-400">Daftar semua pesanan pelanggan</p>
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-[#13141f] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Orders List */}
        <div className="bg-[#13141f]/60 backdrop-blur-lg rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-500 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-white mb-2">Tidak Ada Pesanan</h3>
              <p className="text-gray-400">
                {filter === 'all' ? 'Belum ada pesanan masuk' : `Tidak ada pesanan dengan status ${statusOptions.find(o => o.value === filter)?.label}`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white mb-1">
                        {order.users?.full_name || order.user_id || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-400">{order.users?.email || 'No email'}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white text-lg mb-2">{formatPrice(order.total_amount)}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'awaiting_payment' ? 'bg-orange-500/20 text-orange-400' :
                        order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status === 'awaiting_payment' ? 'Menunggu Pembayaran' :
                         order.status === 'pending' ? 'Pending' :
                         order.status === 'confirmed' ? 'Dikonfirmasi' :
                         order.status === 'shipped' ? 'Dikirim' :
                         order.status === 'delivered' ? 'Selesai' :
                         order.status === 'cancelled' ? 'Dibatalkan' :
                         order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-400 font-medium">Item Pesanan:</p>
                      {order.order_items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm bg-[#0a0a0f]/50 p-3 rounded-lg">
                          <span className="text-gray-300">
                            {item.quantity}x {item.products?.name || 'Unknown Product'}
                          </span>
                          <span className="text-white font-medium">{formatPrice(item.total_price)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Payment Info */}
                  {order.payment_method && (
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <span className="text-gray-400">Metode Pembayaran:</span>
                      <span className="text-white capitalize">{order.payment_method.replace('_', ' ')}</span>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-1">Alamat Pengiriman:</p>
                      <p className="text-sm text-white bg-[#0a0a0f]/50 p-3 rounded-lg">{order.shipping_address}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function OrdersManagementPage() {
  return (
    <AdminProtection>
      <OrdersManagementContent />
    </AdminProtection>
  )
}
