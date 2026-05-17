import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              LensaNusantara
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Toko Peralatan Fotografi Terlengkap di Indonesia
            </p>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
              Temukan kamera, lensa, tripod, dan aksesoris fotografi berkualitas tinggi 
              dengan harga terbaik. Wujudkan passion fotografi Anda bersama kami!
            </p>
            <Link 
              href="/products" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Kategori Produk
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Kamera', icon: '📷', desc: 'DSLR, Mirrorless, Action Cam' },
              { name: 'Lensa', icon: '🔍', desc: 'Prime, Zoom, Macro, Telephoto' },
              { name: 'Tripod', icon: '🎯', desc: 'Carbon, Aluminum, Travel' },
              { name: 'Aksesoris', icon: '⚡', desc: 'Flash, Filter, Memory Card' }
            ].map((category) => (
              <div key={category.name} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.desc}</p>
                <Link 
                  href={`/products?category=${category.name}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Lihat Semua →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Produk Unggulan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: 'Sony Alpha A7 IV', 
                price: 'Rp 25.000.000', 
                category: 'Kamera',
                image: '/placeholder-camera.jpg'
              },
              { 
                name: 'Canon RF 24-70mm f/2.8L', 
                price: 'Rp 18.500.000', 
                category: 'Lensa',
                image: '/placeholder-lens.jpg'
              },
              { 
                name: 'Manfrotto Carbon Tripod', 
                price: 'Rp 3.200.000', 
                category: 'Tripod',
                image: '/placeholder-tripod.jpg'
              }
            ].map((product, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">📷</span>
                </div>
                <div className="p-6">
                  <span className="text-sm text-blue-600 font-medium">{product.category}</span>
                  <h3 className="text-lg font-semibold mt-1 mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">{product.price}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Mengapa Pilih LensaNusantara?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✅',
                title: 'Produk Original',
                desc: 'Semua produk dijamin 100% original dengan garansi resmi'
              },
              {
                icon: '🚚',
                title: 'Pengiriman Cepat',
                desc: 'Pengiriman ke seluruh Indonesia dengan packaging aman'
              },
              {
                icon: '💬',
                title: 'Customer Support',
                desc: 'Tim support yang siap membantu 24/7 via WhatsApp'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
