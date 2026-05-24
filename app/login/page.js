'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../../lib/services/auth'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setMessage('')

  const result = await AuthService.signIn(email, password)

  console.log("LOGIN RESULT:", result)

  if (result.error) {
    setMessage(result.error)
    setLoading(false)
    return
  }

  // 🔥 HANDLE KALAU PROFILE NULL
  if (!result.profile) {
    setMessage("Profile tidak ditemukan (cek RLS / database)")
    setLoading(false)
    return
  }

  const role = result.profile.role
  console.log("ROLE:", role)

  if (role === 'admin') {
    router.push('/dashboard')
  } else {
    router.push('/')
  }

  setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">

      <div className="w-full max-w-md p-8 bg-[#13141f] rounded-2xl shadow-lg border border-white/10">

        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 text-white"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 text-white"
          />

          {/* Message */}
          {message && (
            <p className="text-red-400 text-sm text-center">{message}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

        </form>

      </div>
    </div>
  )
}