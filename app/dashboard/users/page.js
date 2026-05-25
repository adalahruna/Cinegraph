'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtection from '../../../components/AdminProtection'

function UsersManagementContent() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Gagal memuat pengguna')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat pengguna...</p>
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
              <span className="text-white font-medium">Kelola Pengguna</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Kelola Pengguna</h1>
          <p className="text-gray-400">Daftar semua pengguna terdaftar</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-[#13141f]/60 backdrop-blur-lg rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-500 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">Tidak Ada Pengguna</h3>
              <p className="text-gray-400">Belum ada pengguna terdaftar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0f]/50 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Terdaftar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <span className="text-purple-400 font-bold text-sm">
                              {user.full_name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.full_name || 'No Name'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        {users.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5">
              <p className="text-gray-400 text-sm mb-1">Total Pengguna</p>
              <p className="text-3xl font-bold text-white">{users.length}</p>
            </div>
            <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5">
              <p className="text-gray-400 text-sm mb-1">Admin</p>
              <p className="text-3xl font-bold text-purple-400">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="bg-[#13141f]/60 backdrop-blur-lg p-6 rounded-2xl border border-white/5">
              <p className="text-gray-400 text-sm mb-1">User Biasa</p>
              <p className="text-3xl font-bold text-blue-400">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function UsersManagementPage() {
  return (
    <AdminProtection>
      <UsersManagementContent />
    </AdminProtection>
  )
}
