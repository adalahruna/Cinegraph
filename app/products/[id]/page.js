'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  // Mock product data
  const mockProducts = {
    '1': {
      id: '1',
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
    '2': {
      id: '2',
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
      const productData = mockProducts[params.id]
      setProduct(productData)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    // Implementasi add to cart
    alert(`Menambahkan ${quantity} ${product.name} ke keranjang`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Produk yang Anda cari tidak tersedia</p>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Kembali ke Produk
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-blue-600">Products</Link></li>
            <li>/</li>
            <li className="text-gray-800">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-500 text-6xl">📷</span>
              </div>
              
              {/* Thumbnail images would go here */}
              <div className="flex space-x-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer flex items-center justify-center">
                    <span className="text-gray-500 text-sm">📷</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-500">
                  Stok: {product.stock} unit
                </span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                </button>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Fitur Utama</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                  ❤️ Wishlist
                </button>
                <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                  📤 Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b">
              <nav className="flex space-x-8 px-8">
                <button className="py-4 border-b-2 border-blue-600 text-blue-600 font-medium">
                  Spesifikasi
                </button>
                <button className="py-4 text-gray-500 hover:text-gray-700">
                  Deskripsi
                </button>
                <button className="py-4 text-gray-500 hover:text-gray-700">
                  Review
                </button>
              </nav>
            </div>
            
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Spesifikasi Teknis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mock related products */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-3xl">📷</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Produk Terkait {i}</h3>
                  <p className="text-blue-600 font-bold">Rp 5.000.000</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}