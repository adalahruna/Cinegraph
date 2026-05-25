'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../lib/services/auth'

/**
 * Admin Protection Component
 * Wraps admin pages to ensure only admins can access them
 */
export default function AdminProtection({ children }) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAdmin: false,
    user: null,
    profile: null,
    error: null
  })
  const router = useRouter()

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Use regular getCurrentUser (with fallback) instead of strict
        const { user, profile, error } = await AuthService.getCurrentUser()
        
        // No user at all - redirect to login
        if (error || !user) {
          setAuthState({
            isLoading: false,
            isAdmin: false,
            user: null,
            profile: null,
            error: 'Authentication required'
          })
          router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
          return
        }
        
        // User exists but no profile from DB
        if (!profile) {
          console.error('AdminProtection: Profile not found for user:', user.id)
          setAuthState({
            isLoading: false,
            isAdmin: false,
            user,
            profile: null,
            error: 'Profile not found'
          })
          router.push('/')
          return
        }
        
        // Profile exists - check role
        // Accept both 'admin' from DB and fallback profile
        if (profile.role !== 'admin') {
          console.warn('AdminProtection: User role is not admin:', profile.role)
          setAuthState({
            isLoading: false,
            isAdmin: false,
            user,
            profile,
            error: 'Admin privileges required'
          })
          router.push('/')
          return
        }
        
        // All good - user is admin
        console.log('AdminProtection: Access granted for admin:', profile.email)
        setAuthState({
          isLoading: false,
          isAdmin: true,
          user,
          profile,
          error: null
        })
      } catch (err) {
        console.error('AdminProtection error:', err)
        setAuthState({
          isLoading: false,
          isAdmin: false,
          user: null,
          profile: null,
          error: err.message
        })
        router.push('/')
      }
    }
    
    checkAdminAuth()
  }, [router])

  // Loading state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (authState.error || !authState.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-400 text-6xl mb-6">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            {authState.error || 'You do not have permission to access this page.'}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Go to Homepage
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="w-full px-6 py-3 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Success state - render children
  return children
}