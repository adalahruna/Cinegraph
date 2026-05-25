'use client'

import { useState } from 'react'

export default function PaymentModal({ isOpen, onClose, orderData, onPaymentSubmit }) {
  const [paymentData, setPaymentData] = useState({
    method: 'bank_transfer',
    proofFile: null,
    notes: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB')
        return
      }
      
      setPaymentData(prev => ({ ...prev, proofFile: file }))
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!paymentData.proofFile) {
      alert('Silakan upload bukti pembayaran')
      return
    }
    
    setIsUploading(true)
    
    try {
      console.log('Submitting payment proof...')
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout - silakan coba lagi')), 30000)
      })
      
      const uploadPromise = onPaymentSubmit(paymentData)
      
      await Promise.race([uploadPromise, timeoutPromise])
      
      console.log('Payment proof submitted successfully')
      
      // Reset form
      setPaymentData({
        method: 'bank_transfer',
        proofFile: null,
        notes: ''
      })
      setPreviewUrl(null)
      
      onClose()
    } catch (error) {
      console.error('Payment submission error:', error)
      alert(error.message || 'Gagal mengirim bukti pembayaran. Silakan coba lagi.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPaymentData({
      method: 'bank_transfer',
      proofFile: null,
      notes: ''
    })
    setPreviewUrl(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#13141f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Konfirmasi Pembayaran</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            
            {/* Order Summary */}
            <div className="bg-[#0a0a0f]/50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-white mb-3">Ringkasan Pesanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pembayaran</span>
                  <span className="font-bold text-white">{formatPrice(orderData?.total || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-yellow-400">Menunggu Pembayaran</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-400 mb-3">Instruksi Pembayaran</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <p className="font-medium text-white mb-1">Bank Transfer (BCA)</p>
                  <p>No. Rekening: <span className="font-mono bg-[#0a0a0f] px-2 py-1 rounded">1234567890</span></p>
                  <p>Atas Nama: <span className="font-medium">CineGraph Store</span></p>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">E-Wallet (GoPay/OVO/DANA)</p>
                  <p>No. HP: <span className="font-mono bg-[#0a0a0f] px-2 py-1 rounded">081234567890</span></p>
                  <p>Atas Nama: <span className="font-medium">CineGraph Store</span></p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="bank_transfer">Transfer Bank</option>
                  <option value="e_wallet">E-Wallet (GoPay/OVO/DANA)</option>
                  <option value="credit_card">Kartu Kredit</option>
                </select>
              </div>

              {/* Payment Proof Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bukti Pembayaran <span className="text-red-400">*</span>
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors">
                  {previewUrl ? (
                    <div className="space-y-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={previewUrl} 
                        alt="Preview bukti pembayaran" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-400">{paymentData.proofFile?.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(previewUrl)
                          setPreviewUrl(null)
                          setPaymentData(prev => ({ ...prev, proofFile: null }))
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Hapus File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-400 text-4xl mb-2">📷</div>
                      <p className="text-gray-400 mb-2">Upload bukti pembayaran</p>
                      <p className="text-xs text-gray-500 mb-3">Format: JPG, PNG (Max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="payment-proof"
                      />
                      <label
                        htmlFor="payment-proof"
                        className="inline-block px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
                      >
                        Pilih File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Tambahkan catatan jika diperlukan..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !paymentData.proofFile}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-lg hover:from-purple-400 hover:to-blue-300 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Bukti Pembayaran'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}