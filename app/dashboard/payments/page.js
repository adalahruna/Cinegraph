'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminProtection from '../../../components/AdminProtection'

function PaymentConfirmationsContent() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [confirmationNotes, setConfirmationNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

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

  useEffect(() => {
    let isMounted = true

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/payment-confirmations')
        const data = await response.json()

        if (isMounted) {
          if (data.success) {
            setOrders(data.data)
          } else {
            setError(data.error)
          }
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load orders')
          setIsLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      isMounted = false
    }
  }, [])

  const reloadOrders = async () => {
    try {
      const response = await fetch('/api/admin/payment-confirmations')
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to load orders')
    }
  }

  const handleConfirmPayment = async (approved) => {
    if (!selectedOrder) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/payment-confirmations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          approved,
          notes: confirmationNotes
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(approved ? 'Pembayaran berhasil dikonfirmasi!' : 'Pembayaran ditolak')
        setShowModal(false)
        setSelectedOrder(null)
        setConfirmationNotes('')
        reloadOrders() // Reload orders
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Terjadi kesalahan saat memproses konfirmasi')
    } finally {
      setIsProcessing(false)
    }
  }

  const openModal = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
    setConfirmationNotes('')
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
    setConfirmationNotes('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat konfirmasi pembayaran...</p>
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
              <span className="text-white font-medium">Konfirmasi Pembayaran</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Konfirmasi Pembayaran</h1>
          <p className="text-gray-400">Kelola konfirmasi pembayaran dari pelanggan</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Orders List */}
        <div className="bg-[#13141f]/60 backdrop-blur-lg rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-500 text-6xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-white mb-2">Tidak Ada Pembayaran Menunggu</h3>
              <p className="text-gray-400">Semua pembayaran sudah dikonfirmasi</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-bold text-white">
                          {order.users?.full_name || 'Unknown User'}
                        </h3>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                          Menunggu Konfirmasi
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">{order.users?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Pembayaran</p>
                          <p className="text-white font-bold">{formatPrice(order.total_amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Metode Pembayaran</p>
                          <p className="text-white capitalize">{order.payment_method?.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Tanggal Upload</p>
                          <p className="text-white">{formatDate(order.created_at)}</p>
                        </div>
                      </div>

                      {order.payment_notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400">Catatan Pelanggan</p>
                          <p className="text-white bg-[#0a0a0f]/50 p-3 rounded-lg">{order.payment_notes}</p>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Item Pesanan</p>
                        <div className="space-y-1">
                          {order.order_items?.map((item, index) => (
                            <div key={index} className="text-sm text-gray-300">
                              {item.quantity}x {item.products?.name} - {formatPrice(item.total_price)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 ml-6">
                      {order.payment_proof_url && (
                        <a
                          href={order.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium text-center"
                        >
                          Lihat Bukti
                        </a>
                      )}
                      <button
                        onClick={() => openModal(order)}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                      >
                        Konfirmasi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#13141f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Konfirmasi Pembayaran</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-white mb-2">{selectedOrder.users?.full_name}</h3>
                  <p className="text-gray-400 mb-1">{selectedOrder.users?.email}</p>
                  <p className="text-lg font-bold text-white">{formatPrice(selectedOrder.total_amount)}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Catatan Admin (Opsional)
                  </label>
                  <textarea
                    value={confirmationNotes}
                    onChange={(e) => setConfirmationNotes(e.target.value)}
                    placeholder="Tambahkan catatan untuk pelanggan..."
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleConfirmPayment(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors font-medium disabled:opacity-50"
                  >
                    {isProcessing ? 'Memproses...' : 'Tolak'}
                  </button>
                  <button
                    onClick={() => handleConfirmPayment(true)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {isProcessing ? 'Memproses...' : 'Setujui'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PaymentConfirmationsPage() {
  return (
    <AdminProtection>
      <PaymentConfirmationsContent />
    </AdminProtection>
  )
}