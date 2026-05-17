import { supabase, TABLES } from '../supabase'

/**
 * Authentication Service
 * Handles user registration, login, logout, and session management
 */
export class AuthService {
  
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user data
   * @returns {Promise<{user, error}>}
   */
  static async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name || '',
            phone: metadata.phone || '',
            address: metadata.address || null
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data.user, error: null }
    } catch (err) {
      return { user: null, error: err.message }
    }
  }

  /**
   * Sign in user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user, session, error}>}
   */
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { user: null, session: null, error: error.message }
      }

      // Get user profile with role
      const userProfile = await this.getUserProfile(data.user.id)
      
      return { 
        user: data.user, 
        session: data.session, 
        profile: userProfile.profile,
        error: null 
      }
    } catch (err) {
      return { user: null, session: null, error: err.message }
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<{error}>}
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (err) {
      return { error: err.message }
    }
  }

  /**
   * Get current authenticated user
   * @returns {Promise<{user, profile, error}>}
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return { user: null, profile: null, error: error?.message || 'No user found' }
      }

      // Get user profile with role
      const userProfile = await this.getUserProfile(user.id)
      
      return { 
        user, 
        profile: userProfile.profile, 
        error: userProfile.error 
      }
    } catch (err) {
      return { user: null, profile: null, error: err.message }
    }
  }

  /**
   * Get user profile from users table
   * @param {string} userId - User ID
   * @returns {Promise<{profile, error}>}
   */
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { profile: null, error: error.message }
      }

      return { profile: data, error: null }
    } catch (err) {
      return { profile: null, error: err.message }
    }
  }
}