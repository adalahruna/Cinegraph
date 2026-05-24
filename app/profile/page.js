'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthService } from '../../lib/services/auth'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const { user, profile } = await AuthService.getCurrentUser()
      setUser(user)
      setProfile(profile)
      setIsLoading(false)
    }
    fetchUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0a0a0f]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0a0a0f] px-4 text-center">
        <div className="bg-[#13141f] p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Dibatasi</h1>
          <p className="text-gray-400 mb-8">Anda harus login terlebih dahulu untuk mengakses halaman profil ini.</p>
          <Link href="/login" className="block w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/20">
            Masuk ke Akun
          </Link>
          <Link href="/" className="block mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="bg-[#13141f]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Profil */}
          <div className="h-32 bg-gradient-to-r from-purple-600/30 to-blue-600/30"></div>
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 bg-[#0a0a0f] rounded-2xl border-4 border-[#13141f] flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400 overflow-hidden shadow-xl">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-2 right-0 w-6 h-6 bg-green-500 border-4 border-[#13141f] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-1">
                  {profile?.full_name || 'Pengguna'}
                </h1>
                <p className="text-purple-400 font-medium text-sm flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-md">
                    {profile?.role?.toUpperCase() || 'USER'}
                  </span>
                </p>
              </div>
              <div className="flex md:justify-end items-start pt-2">
                 <button onClick={() => router.push('/')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-gray-300 transition-all">
                   Edit Profil
                 </button>
              </div>
            </div>

            <div className="mt-10 border-t border-white/5 pt-10 grid grid-cols-1 gap-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Alamat Email</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nomor Telepon</span>
                <span className="text-white font-medium">{profile?.phone || '-'}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bergabung Sejak</span>
                <span className="text-white font-medium">
                  {new Date(profile?.created_at || user.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}