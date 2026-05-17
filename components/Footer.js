export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LensaNusantara</h3>
            <p className="text-gray-300">
              Toko online peralatan fotografi terlengkap di Indonesia. 
              Menyediakan kamera, lensa, dan aksesoris berkualitas tinggi.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategori</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Kamera</a></li>
              <li><a href="#" className="hover:text-white">Lensa</a></li>
              <li><a href="#" className="hover:text-white">Tripod</a></li>
              <li><a href="#" className="hover:text-white">Aksesoris</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@lensanusantara.com</li>
              <li>Phone: +62 21 1234 5678</li>
              <li>WhatsApp: +62 812 3456 7890</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 LensaNusantara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}