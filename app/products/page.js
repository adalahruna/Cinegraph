'use client'

import { useState, useEffect } from 'react'
import { useCart } from '../../contexts/CartContext'

// Mock data untuk demo - moved outside component to avoid dependency issues
const mockProducts = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Sony Alpha A7 IV',
    category: 'Kamera',
    price: 25000000,
    stock: 5,
    description: 'Mirrorless camera dengan sensor 33MP dan video 4K',
    image_url: null
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Canon RF 24-70mm f/2.8L',
    category: 'Lensa',
    price: 18500000,
    stock: 3,
    description: 'Lensa zoom profesional untuk Canon RF mount',
    image_url: null
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Manfrotto Carbon Tripod',
    category: 'Tripod',
    price: 3200000,
    stock: 8,
    description: 'Tripod carbon fiber ringan dan stabil',
    image_url: null
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Nikon Z6 II',
    category: 'Kamera',
    price: 22000000,
    stock: 4,
    description: 'Full frame mirrorless dengan dual card slots',
    image_url: null
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Sony FE 85mm f/1.4 GM',
    category: 'Lensa',
    price: 21000000,
    stock: 2,
    description: 'Lensa portrait premium dengan bokeh yang indah',
    image_url: null
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Godox AD200Pro',
    category: 'Aksesoris',
    price: 4500000,
    stock: 6,
    description: 'Portable flash dengan power 200Ws',
    image_url: null
  }
]

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    // Simulasi loading
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, []) // Now no dependency issues

  const categories = ['Kamera', 'Lensa', 'Tripod', 'Aksesoris']

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    alert(`${product.name} berhasil ditambahkan ke keranjang!`)
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
          <p className="text-gray-400 font-medium tracking-wide animate-pulse">Memuat katalog produk...</p>
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
        <h1 className="text-[12vw] font-black tracking-tighter whitespace-nowrap">PRODUCTS</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-3 pb-1">
            Katalog Produk
          </h1>
          <p className="text-gray-400 text-lg">Temukan peralatan fotografi terbaik untuk kebutuhan Anda</p>
        </div>

        {/* Filters Panel (Glassmorphism) */}
        <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Cari Produk
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik nama atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 pl-11 bg-[#0a0a0f]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
                <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Kategori
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-[#0a0a0f]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#0a0a0f] text-gray-200">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-[#0a0a0f] text-gray-200">
                      {category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 flex flex-col">
              
              {/* Product Image Placeholder */}
              <div className="h-56 bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-gray-500 text-5xl relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">📷</span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-2">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
                  {product.description}
                </p>
                
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Harga</p>
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${product.stock > 0 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    Stok: {product.stock}
                  </span>
                </div>

                <div className="space-y-2 mt-auto">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full relative flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-400 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:from-purple-500 disabled:hover:to-blue-400"
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                  </button>
                  <a 
                    href={`/products/${product.id}`}
                    className="block w-full text-center py-2.5 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-bold text-gray-300 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13141f] focus:ring-gray-500 transition-all duration-300"
                  >
                    Lihat Detail
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Found State */}
        {filteredProducts.length === 0 && (
          <div className="bg-[#13141f]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] text-center py-16 px-4 mt-8">
            <div className="text-6xl mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Maaf, kami tidak dapat menemukan produk yang sesuai dengan filter atau kata kunci &ldquo;{searchTerm}&rdquo;. Silakan coba kata kunci lain.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="mt-6 inline-flex items-center justify-center px-6 py-2.5 border border-white/10 text-sm font-bold rounded-xl text-gray-300 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}