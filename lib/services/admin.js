import { supabase, TABLES } from '../supabase'
import { AuthService } from './auth'

/**
 * Admin Service
 * Handles all admin-related operations with proper security checks
 */
export class AdminService {

  /**
   * Get dashboard statistics
   * @returns {Promise<{stats, error}>}
   */
  static async getDashboardStats() {
    try {
      // Verify admin access - getCurrentUser now returns fallback profile if RLS blocks
      const { user, profile, error: authError } = await AuthService.getCurrentUser()
      
      if (authError || !user) {
        return { stats: null, error: 'Authentication failed' }
      }
      
      if (!profile || profile.role !== 'admin') {
        return { stats: null, error: 'Unauthorized: Admin access required' }
      }

      // Get user count
      const { count: userCount, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*', { count: 'exact', head: true })

      if (userError) {
        console.error('Error getting user count:', userError)
      }

      // Get product count
      const { count: productCount, error: productError } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      if (productError) {
        console.error('Error getting product count:', productError)
      }

      // Get order count
      const { count: orderCount, error: orderError } = await supabase
        .from(TABLES.ORDERS)
        .select('*', { count: 'exact', head: true })

      if (orderError) {
        console.error('Error getting order count:', orderError)
      }

      // Get recent orders - try with user join first, fallback to orders only
      let recentOrders = []
      const { data: ordersWithUsers, error: recentOrdersError } = await supabase
        .from(TABLES.ORDERS)
        .select(`
          *,
          users (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentOrdersError) {
        console.warn('Could not fetch orders with user data, trying without join:', recentOrdersError)
        
        // Fallback: get orders without user join
        const { data: ordersOnly, error: fallbackError } = await supabase
          .from(TABLES.ORDERS)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (!fallbackError && ordersOnly) {
          recentOrders = ordersOnly
        }
      } else if (ordersWithUsers) {
        recentOrders = ordersWithUsers
      }

      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from(TABLES.ORDERS)
        .select('total_amount')
        .eq('status', 'delivered')

      let totalRevenue = 0
      if (!revenueError && revenueData) {
        totalRevenue = revenueData.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
      }

      return {
        stats: {
          userCount: userCount || 0,
          productCount: productCount || 0,
          orderCount: orderCount || 0,
          totalRevenue,
          recentOrders: recentOrders || []
        },
        error: null
      }
    } catch (err) {
      return { stats: null, error: err.message }
    }
  }

  /**
   * Get all users (admin only)
   * @param {Object} options - Query options
   * @returns {Promise<{users, error}>}
   */
  static async getAllUsers(options = {}) {
    try {
      // Verify admin access - getCurrentUser now returns fallback profile if RLS blocks
      const { user, profile, error: authError } = await AuthService.getCurrentUser()
      
      if (authError || !user || !profile || profile.role !== 'admin') {
        return { users: [], error: 'Unauthorized: Admin access required' }
      }

      let query = supabase
        .from(TABLES.USERS)
        .select('*')
        .order('created_at', { ascending: false })

      // Apply pagination
      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit
        const to = from + options.limit - 1
        query = query.range(from, to)
      } else if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        return { users: [], error: error.message }
      }

      return { users: data || [], error: null }
    } catch (err) {
      return { users: [], error: err.message }
    }
  }

  /**
   * Get all orders (admin only)
   * @param {Object} options - Query options
   * @returns {Promise<{orders, error}>}
   */
  static async getAllOrders(options = {}) {
    try {
      // Verify admin access - getCurrentUser now returns fallback profile if RLS blocks
      const { user, profile, error: authError } = await AuthService.getCurrentUser()
      
      if (authError || !user || !profile || profile.role !== 'admin') {
        return { orders: [], error: 'Unauthorized: Admin access required' }
      }

      let query = supabase
        .from(TABLES.ORDERS)
        .select(`
          *,
          users (
            full_name,
            email
          ),
          order_items (
            *,
            products (
              name,
              category
            )
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (options.status) {
        query = query.eq('status', options.status)
      }

      // Apply pagination
      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit
        const to = from + options.limit - 1
        query = query.range(from, to)
      } else if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        return { orders: [], error: error.message }
      }

      return { orders: data || [], error: null }
    } catch (err) {
      return { orders: [], error: err.message }
    }
  }

  /**
   * Update user role (super admin only)
   * @param {string} userId - User ID
   * @param {string} newRole - New role ('admin' or 'user')
   * @returns {Promise<{user, error}>}
   */
  static async updateUserRole(userId, newRole) {
    try {
      // Verify admin access - getCurrentUser now returns fallback profile if RLS blocks
      const { user, profile, error: authError } = await AuthService.getCurrentUser()
      
      if (authError || !user || !profile || profile.role !== 'admin') {
        return { user: null, error: 'Unauthorized: Admin access required' }
      }

      // Prevent self-demotion
      if (user.id === userId && newRole !== 'admin') {
        return { user: null, error: 'Cannot change your own admin role' }
      }

      // Validate role
      if (!['admin', 'user'].includes(newRole)) {
        return { user: null, error: 'Invalid role. Must be "admin" or "user"' }
      }

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data, error: null }
    } catch (err) {
      return { user: null, error: err.message }
    }
  }

  /**
   * Delete user (admin only)
   * @param {string} userId - User ID
   * @returns {Promise<{success, error}>}
   */
  static async deleteUser(userId) {
    try {
      // Verify admin access - getCurrentUser now returns fallback profile if RLS blocks
      const { user, profile, error: authError } = await AuthService.getCurrentUser()
      
      if (authError || !user || !profile || profile.role !== 'admin') {
        return { success: false, error: 'Unauthorized: Admin access required' }
      }

      // Prevent self-deletion
      if (user.id === userId) {
        return { success: false, error: 'Cannot delete your own account' }
      }

      const { error } = await supabase
        .from(TABLES.USERS)
        .delete()
        .eq('id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }
}