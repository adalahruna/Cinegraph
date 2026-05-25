'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtection from '../../../components/AdminProtection'

function ProductsManagementContent() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()

      if (data.success) {
        setProducts(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Gagal memuat produk')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat produk...</p>
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
              <span className="text-white font-medium">Kelola Produk</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Kelola Produk</h1>
          <p className="text-gray-400">Daftar semua produk CineGraph</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-[#13141f]/60 backdrop-blur-lg rounded-2xl border border-white/5 shadow-lg overflow-hidden hover:border-purple-500/30 transition-all duration-300">
              {product.image_url && (
                <div className="aspect-video bg-[#0a0a0f] overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-white text-lg">{product.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Harga</span>
                    <span className="text-white font-bold">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stok</span>
                    <span className={`font-medium ${
                      product.stock > 10 ? 'text-green-400' : 
                      product.stock > 0 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {product.stock} unit
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Kategori</span>
                    <span className="text-white capitalize">{product.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">Belum Ada Produk</h3>
            <p className="text-gray-400">Produk akan muncul di sini</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ProductsManagementPage() {
  return (
    <AdminProtection>
      <ProductsManagementContent />
    </AdminProtection>
  )
}
