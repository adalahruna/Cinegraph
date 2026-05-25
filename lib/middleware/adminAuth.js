import { AuthService } from '../services/auth'

/**
 * Admin Authentication Middleware
 * Validates admin access for protected routes and API endpoints
 */
export class AdminAuthMiddleware {
  
  /**
   * Check if user has admin privileges
   * @returns {Promise<{isAdmin: boolean, user: object, profile: object, error: string}>}
   */
  static async validateAdmin() {
    try {
      const { user, profile, error } = await AuthService.getCurrentUser()
      
      if (error || !user) {
        return {
          isAdmin: false,
          user: null,
          profile: null,
          error: 'Authentication required'
        }
      }
      
      if (!profile || profile.role !== 'admin') {
        return {
          isAdmin: false,
          user,
          profile,
          error: 'Admin privileges required'
        }
      }
      
      return {
        isAdmin: true,
        user,
        profile,
        error: null
      }
    } catch (err) {
      return {
        isAdmin: false,
        user: null,
        profile: null,
        error: err.message
      }
    }
  }
  
  /**
   * API Route Protection Middleware
   * Use this in API routes to protect admin endpoints
   */
  static async protectApiRoute(req, res, next) {
    const { isAdmin, error } = await AdminAuthMiddleware.validateAdmin()
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: error || 'Access denied'
      })
    }
    
    // If using Express-style middleware
    if (next) {
      return next()
    }
    
    return true
  }
  
  /**
   * Client-side route protection hook
   * Use this in React components to protect admin pages
   */
  static useAdminAuth() {
    const [authState, setAuthState] = useState({
      isLoading: true,
      isAdmin: false,
      user: null,
      profile: null,
      error: null
    })
    
    useEffect(() => {
      const checkAdminAuth = async () => {
        const result = await AdminAuthMiddleware.validateAdmin()
        setAuthState({
          isLoading: false,
          isAdmin: result.isAdmin,
          user: result.user,
          profile: result.profile,
          error: result.error
        })
      }
      
      checkAdminAuth()
    }, [])
    
    return authState
  }
}