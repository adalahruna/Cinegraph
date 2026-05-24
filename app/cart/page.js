'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '../../contexts/CartContext'
import { AuthService } from '../../lib/services/auth'

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, totalPrice, checkout } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const router = useRouter()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    setCheckoutError('')

    try {
      console.log('Starting checkout process...')
      
      // Check if user is logged in
      const { user } = await AuthService.getCurrentUser()
      if (!user) {
        console.log('User not logged in, redirecting to login')
        router.push('/login?redirect=/cart')
        return
      }
      
      console.log('User is logged in:', user.id)

      // Process checkout
      const result = await checkout({
        shippingCost: 50000,
        shippingAddress: {
          street: 'Default Address',
          city: 'Jakarta',
          postal_code: '12345',
          country: 'Indonesia'
        },
        notes: 'Order from cart'
      })
      
      console.log('Checkout completed with result:', result)

      if (result.error) {
        console.error('Checkout failed:', result.error)
        setCheckoutError(result.error)
      } else {
        console.log('Checkout successful, redirecting to profile')
        // Success - redirect to success page or show success message
        alert('Pesanan berhasil dibuat! Terima kasih telah berbelanja di CineGraph.')
        router.push('/profile') // Redirect to profile to see order history
      }
    } catch (error) {
      console.error('Checkout error in handleCheckout:', error)
      setCheckoutError(error.message || 'Terjadi kesalahan saat memproses pesanan')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const subtotal = totalPrice
  const shipping = 50000 // Fixed shipping cost
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans relative overflow-hidden">
      
      {/* Background Gradient & Glow Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Large Faint Watermark Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.02] pointer-events-none select-none overflow-hidden w-full text-center fixed">
        <h1 className="text-[15vw] font-black tracking-tighter whitespace-nowrap">CART</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 pb-1">
            Keranjang Belanja
          </h1>
          <span className="text-sm font-medium text-gray-400 bg-[#13141f] border border-white/10 px-4 py-2 rounded-full">
            {cartItems.length} Item
          </span>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-12 text-center max-w-2xl mx-auto mt-12">
            <div className="text-7xl mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">🛒</div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">
              Keranjang Anda Kosong
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Sepertinya Anda belum menambahkan perlengkapan fotografi apa pun ke keranjang Anda.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-400 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300"
            >
              Mulai Eksplorasi Produk
            </Link>
          </div>
        ) : (
          /* Filled Cart State */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                  <h2 className="text-lg font-bold text-white">
                    Daftar Produk
                  </h2>
                </div>
                
                <div className="divide-y divide-white/5">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 hover:bg-white/[0.02] transition-colors duration-200">
                      
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-[#0a0a0f] border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                        <span className="text-gray-500 text-3xl relative z-10">📷</span>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="text-lg font-bold text-white truncate mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider text-[11px] font-semibold">{item.category}</p>
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      {/* Controls Container */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1 bg-[#0a0a0f] border border-white/10 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-400 p-2 transition-colors rounded-full hover:bg-red-500/10"
                          title="Hapus item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-6 sticky top-8">
                <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">
                  Ringkasan Pesanan
                </h2>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Subtotal ({cartItems.length} barang)</span>
                    <span className="font-medium text-gray-200">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Estimasi Ongkos Kirim</span>
                    <span className="font-medium text-gray-200">{formatPrice(shipping)}</span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-white">Total Tagihan</span>
                      <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {checkoutError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {checkoutError}
                  </div>
                )}
                
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-400 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </>
                  ) : (
                    'Beli Sekarang'
                  )}
                </button>
                
                <Link 
                  href="/products"
                  className="w-full flex justify-center py-3.5 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-bold text-gray-300 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-gray-500 transition-all duration-300"
                >
                  Lanjut Belanja
                </Link>
                
                {/* Shipping Info - Dark Mode Adapted */}
                <div className="mt-8 p-4 bg-[#0a0a0f]/50 border border-white/5 rounded-xl">
                  <h3 className="font-semibold text-gray-300 mb-3 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                    Info Pengiriman
                  </h3>
                  <ul className="text-xs text-gray-400 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400">•</span>
                      Gratis ongkir untuk pembelian di atas Rp 1.000.000
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400">•</span>
                      Estimasi pengiriman 2-3 hari kerja
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400">•</span>
                      Garansi kemasan aman dengan bubble wrap ekstra
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  )
}