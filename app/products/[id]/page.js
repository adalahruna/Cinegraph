'use client'

import { useState, useEffect } from 'react'
import { useCart } from '../../../contexts/CartContext'
// Menghapus import Next.js yang menyebabkan error di preview
// import { useParams } from 'next/navigation'
// import Link from 'next/link'

export default function ProductDetailPage() {
  // Mock useParams functionality for preview environment
  const params = { id: '1' } // Fallback static ID
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('spesifikasi')
  const { addToCart } = useCart()

  // Mock product data
  const mockProducts = {
    '550e8400-e29b-41d4-a716-446655440001': {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Sony Alpha A7 IV',
      category: 'Kamera',
      price: 25000000,
      stock: 5,
      description: 'Sony Alpha A7 IV adalah kamera mirrorless full-frame yang menggabungkan resolusi tinggi 33MP dengan kemampuan video 4K yang luar biasa. Dilengkapi dengan sistem autofocus yang canggih dan stabilisasi gambar 5-axis, kamera ini cocok untuk fotografer profesional dan videografer.',
      specifications: {
        'Sensor': 'Full-frame 35mm Exmor R CMOS',
        'Resolusi': '33 Megapixel',
        'Video': '4K 60p, Full HD 120p',
        'ISO': '100-51200 (diperluas 50-204800)',
        'Autofocus': '759 titik phase-detection',
        'Stabilisasi': '5-axis in-body stabilization',
        'Layar': '3.0" vari-angle touchscreen',
        'Baterai': 'NP-FZ100 (530 shots)',
        'Dimensi': '131.3 x 96.4 x 79.8 mm',
        'Berat': '658g (dengan baterai)'
      },
      features: [
        'Real-time Eye AF untuk manusia dan hewan',
        'Dual card slots (CFexpress Type A / SD)',
        'Weather sealing untuk kondisi cuaca ekstrem',
        'Silent shooting mode',
        'Built-in Wi-Fi dan Bluetooth',
        'USB-C untuk charging dan transfer data'
      ],
      images: ['/placeholder-camera.jpg']
    },
    '550e8400-e29b-41d4-a716-446655440002': {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Canon RF 24-70mm f/2.8L',
      category: 'Lensa',
      price: 18500000,
      stock: 3,
      description: 'Canon RF 24-70mm f/2.8L IS USM adalah lensa zoom standar profesional untuk sistem Canon RF. Dengan aperture konstan f/2.8 dan stabilisasi gambar hingga 5 stop, lensa ini memberikan kualitas gambar yang luar biasa dalam berbagai kondisi pencahayaan.',
      specifications: {
        'Focal Length': '24-70mm',
        'Aperture': 'f/2.8 (konstan)',
        'Mount': 'Canon RF',
        'Stabilisasi': '5-stop IS',
        'Elemen Lensa': '21 elemen dalam 15 grup',
        'Diafragma': '9 bilah circular',
        'Jarak Fokus Minimum': '0.21m (wide), 0.3m (tele)',
        'Filter': '82mm',
        'Dimensi': '88.8 x 125.7mm',
        'Berat': '900g'
      },
      features: [
        'Nano USM motor untuk autofocus cepat dan senyap',
        'Weather sealing dengan fluorine coating',
        'Control ring yang dapat dikustomisasi',
        'Dual Pixel CMOS AF compatibility',
        'Aberasi kromatik minimal',
        'Bokeh yang halus dan natural'
      ],
      images: ['/placeholder-lens.jpg']
    }
  }

  useEffect(() => {
    // Simulasi loading
    setTimeout(() => {
      // Untuk demo, jika id tidak ditemukan, tampilkan produk 1 sebagai fallback sementara
      const productId = params?.id || '550e8400-e29b-41d4-a716-446655440001'; 
      const productData = mockProducts[productId]
      setProduct(productData)
      setLoading(false)
    }, 1000)
  }, [params?.id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, quantity)
      alert(`${quantity} unit ${product.name} berhasil ditambahkan ke keranjang!`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
        {/* Background Gradient & Glow Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full"></div>
        </div>
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          <p className="text-gray-400 font-medium tracking-wide animate-pulse">Memuat detail produk...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
        {/* Background Gradient & Glow Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/20 blur-[120px] rounded-full"></div>
        </div>
        <div className="text-center z-10 bg-[#13141f]/80 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          <div className="text-6xl mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">Produk yang Anda cari tidak tersedia atau mungkin telah dihapus.</p>
          <a href="/products" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-400 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300">
            Kembali ke Katalog
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans relative overflow-hidden pb-20">
      
      {/* Background Gradient & Glow Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[40%] left-[-5%] w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Large Faint Watermark Background */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.02] pointer-events-none select-none overflow-hidden w-full text-center fixed">
        <h1 className="text-[12vw] font-black tracking-tighter whitespace-nowrap uppercase">{product.category}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Breadcrumb - Dark Mode Styled */}
        <nav className="mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-purple-400 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                Home
              </a>
            </li>
            <li className="text-gray-700">/</li>
            <li><a href="/products" className="hover:text-purple-400 transition-colors">Products</a></li>
            <li className="text-gray-700">/</li>
            <li><span className="hover:text-purple-400 transition-colors cursor-pointer">{product.category}</span></li>
            <li className="text-gray-700">/</li>
            <li className="text-gray-300 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images Container */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-2 relative group overflow-hidden">
              <div className="aspect-square bg-[#0a0a0f] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
                <span className="text-gray-500 text-8xl relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">📷</span>
                
                {/* Sale/New Badge (Optional) */}
                <div className="absolute top-4 left-4 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md z-20">
                  NEW ARRIVAL
                </div>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`flex-shrink-0 w-20 h-20 bg-[#13141f] rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${i === 1 ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-white/10 hover:border-purple-500/50'}`}
                >
                  <span className="text-gray-500 text-2xl">📷</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Panel */}
          <div>
            <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-6 sm:p-8">
              
              <span className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2 block">
                {product.category}
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-black text-white mt-1 mb-6 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-8 border-b border-white/10">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {formatPrice(product.price)}
                </span>
                
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400 text-sm">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-600">★</span>
                  </div>
                  <span className="text-xs text-gray-400 underline decoration-gray-600 underline-offset-4 cursor-pointer hover:text-gray-300">
                    (24 Ulasan)
                  </span>
                </div>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>

              {/* Status Stock */}
              <div className="mb-6 flex items-center">
                <span className="relative flex h-3 w-3 mr-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `Tersedia ${product.stock} unit` : 'Stok Habis'}
                </span>
              </div>

              {/* Action Area: Quantity & Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                
                {/* Quantity Control */}
                <div className="flex items-center justify-between bg-[#0a0a0f] border border-white/10 rounded-xl p-1.5 w-full sm:w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold text-white text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex justify-center items-center py-4 px-6 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-400 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Kosong'}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center border border-white/10 text-gray-300 py-3 px-4 rounded-xl hover:bg-white/5 hover:border-purple-500/50 hover:text-purple-400 transition-all duration-300 font-medium text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  Simpan Wishlist
                </button>
                <button className="flex items-center justify-center border border-white/10 text-gray-300 py-3 px-4 rounded-xl hover:bg-white/5 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 font-medium text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  Bagikan
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Product Details Tabs Panel (Glassmorphism) */}
        <div className="mt-12">
          <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden">
            
            {/* Tabs Header */}
            <div className="border-b border-white/10 bg-white/[0.02]">
              <nav className="flex overflow-x-auto scrollbar-hide">
                {['spesifikasi', 'fitur', 'review'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-5 px-8 text-sm font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all duration-300 ${
                      activeTab === tab 
                        ? 'border-purple-500 text-purple-400 bg-white/[0.03]' 
                        : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tabs Content */}
            <div className="p-6 sm:p-10 min-h-[300px]">
              
              {/* Content Spesifikasi */}
              <div className={`transition-opacity duration-500 ${activeTab === 'spesifikasi' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <h3 className="text-xl font-bold text-white mb-6">Spesifikasi Teknis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-white/5 group hover:border-white/10 transition-colors">
                      <span className="font-medium text-gray-500 group-hover:text-gray-400">{key}</span>
                      <span className="text-gray-300 text-right w-1/2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Fitur Utama */}
              <div className={`transition-opacity duration-500 ${activeTab === 'fitur' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <h3 className="text-xl font-bold text-white mb-6">Fitur Utama</h3>
                <ul className="space-y-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start bg-[#0a0a0f]/50 p-4 rounded-xl border border-white/5">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 mt-0.5">
                        <span className="text-purple-400 text-xs">✓</span>
                      </div>
                      <span className="text-gray-300 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Review (Placeholder) */}
              <div className={`transition-opacity duration-500 ${activeTab === 'review' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <div className="text-center py-10">
                  <div className="text-5xl mb-4 opacity-50">⭐</div>
                  <h3 className="text-xl font-bold text-white mb-2">Belum ada ulasan</h3>
                  <p className="text-gray-500">Jadilah yang pertama mengulas produk ini setelah membelinya.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Mungkin Anda Suka</h2>
            <a href="/products" className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center transition-colors">
              Lihat Semua
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mock related products styled like catalog */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 flex flex-col cursor-pointer">
                <div className="h-48 bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-gray-500 text-4xl relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">📷</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">Aksesoris Terkait {i}</h3>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-bold mt-auto">
                    Rp {i}.500.000
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}