'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data untuk demo
  const mockProducts = [
    {
      id: '1',
      name: 'Sony Alpha A7 IV',
      category: 'Kamera',
      price: 25000000,
      stock: 5,
      description: 'Mirrorless camera dengan sensor 33MP dan video 4K',
      image_url: null
    },
    {
      id: '2',
      name: 'Canon RF 24-70mm f/2.8L',
      category: 'Lensa',
      price: 18500000,
      stock: 3,
      description: 'Lensa zoom profesional untuk Canon RF mount',
      image_url: null
    },
    {
      id: '3',
      name: 'Manfrotto Carbon Tripod',
      category: 'Tripod',
      price: 3200000,
      stock: 8,
      description: 'Tripod carbon fiber ringan dan stabil',
      image_url: null
    },
    {
      id: '4',
      name: 'Nikon Z6 II',
      category: 'Kamera',
      price: 22000000,
      stock: 4,
      description: 'Full frame mirrorless dengan dual card slots',
      image_url: null
    },
    {
      id: '5',
      name: 'Sony FE 85mm f/1.4 GM',
      category: 'Lensa',
      price: 21000000,
      stock: 2,
      description: 'Lensa portrait premium dengan bokeh yang indah',
      image_url: null
    },
    {
      id: '6',
      name: 'Godox AD200Pro',
      category: 'Aksesoris',
      price: 4500000,
      stock: 6,
      description: 'Portable flash dengan power 200Ws',
      image_url: null
    }
  ]

  useEffect(() => {
    // Simulasi loading
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Semua Produk</h1>
          <p className="text-gray-600">Temukan peralatan fotografi terbaik untuk kebutuhan Anda</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Produk
              </label>
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-4xl">📷</span>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="text-lg font-semibold mt-1 mb-2 text-gray-800 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stok: {product.stock}
                  </span>
                </div>

                <div className="space-y-2">
                  <button 
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                  </button>
                  <Link 
                    href={`/products/${product.id}`}
                    className="block w-full text-center border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Produk tidak ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  )
}