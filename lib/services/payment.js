import { supabase, TABLES, STORAGE_BUCKETS } from '../supabase'
import { AuthService } from './auth'

/**
 * Payment Service
 * Handles payment proof upload and confirmation workflow
 */
export class PaymentService {

  /**
   * Upload payment proof for an order
   * @param {string} orderId - Order ID
   * @param {Object} paymentData - Payment data including file and method
   * @returns {Promise<{success, error}>}
   */
  static async uploadPaymentProof(orderId, paymentData) {
    try {
      console.log('Starting payment proof upload for order:', orderId)
      
      // Check if user is authenticated and owns the order
      const { user } = await AuthService.getCurrentUser()
      if (!user) {
        return { success: false, error: 'User must be logged in' }
      }

      // Verify order ownership
      const { data: order, error: orderError } = await supabase
        .from(TABLES.ORDERS)
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (orderError || !order) {
        console.error('Order verification failed:', orderError)
        return { success: false, error: 'Order not found or access denied' }
      }

      // Check if order is in correct status
      if (order.payment_status === 'confirmed') {
        return { success: false, error: 'Payment already confirmed' }
      }

      // Skip file upload for now - just update order status
      // File upload will be handled later when storage is properly configured
      let paymentProofUrl = 'pending-upload'
      
      if (paymentData.proofFile) {
        console.log('File upload skipped (storage not configured):', paymentData.proofFile.name)
        paymentProofUrl = `pending-${paymentData.proofFile.name}`
      }

      // Update order with payment info (without file upload)
      console.log('Updating order with payment data...')
      const { error: updateError } = await supabase
        .from(TABLES.ORDERS)
        .update({
          payment_proof_url: paymentProofUrl,
          payment_method: paymentData.method,
          payment_status: 'uploaded',
          payment_notes: paymentData.notes || null,
          status: 'awaiting_payment'
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Order update error:', updateError)
        return { success: false, error: 'Failed to update order: ' + updateError.message }
      }

      console.log('Payment proof recorded successfully (file upload skipped)')
      return { success: true, error: null }
    } catch (err) {
      console.error('Payment proof upload error:', err)
      return { success: false, error: err.message || 'Upload failed' }
    }
  }

  /**
   * Confirm payment (admin only)
   * @param {string} orderId - Order ID
   * @param {boolean} approved - Whether payment is approved
   * @param {string} notes - Admin notes
   * @returns {Promise<{success, error}>}
   */
  static async confirmPayment(orderId, approved, notes = '') {
    try {
      // Check admin permissions
      const { user, profile } = await AuthService.getCurrentUser()
      if (!user || !profile || profile.role !== 'admin') {
        return { success: false, error: 'Admin access required' }
      }

      // Get order
      const { data: order, error: orderError } = await supabase
        .from(TABLES.ORDERS)
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        return { success: false, error: 'Order not found' }
      }

      // Update payment status
      const updateData = {
        payment_status: approved ? 'confirmed' : 'rejected',
        payment_confirmed_at: new Date().toISOString(),
        payment_confirmed_by: user.id,
        payment_notes: notes
      }

      // If approved, also update order status
      if (approved) {
        updateData.status = 'confirmed'
      }

      const { error: updateError } = await supabase
        .from(TABLES.ORDERS)
        .update(updateData)
        .eq('id', orderId)

      if (updateError) {
        console.error('Payment confirmation error:', updateError)
        return { success: false, error: 'Failed to confirm payment' }
      }

      return { success: true, error: null }
    } catch (err) {
      console.error('Payment confirmation error:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Get orders awaiting payment confirmation (admin only)
   * @param {Object} options - Query options
   * @returns {Promise<{orders, error}>}
   */
  static async getOrdersAwaitingPayment(options = {}) {
    try {
      // Skip admin check if called from API route (skipAuthCheck flag)
      // API routes are already protected by middleware
      if (!options.skipAuthCheck) {
        const { user, profile } = await AuthService.getCurrentUser()
        if (!user || !profile || profile.role !== 'admin') {
          return { orders: [], error: 'Admin access required' }
        }
      }

      // Try with JOIN first
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
        .eq('payment_status', 'uploaded')
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

      // If JOIN query fails, try simple query without relations
      if (error) {
        console.log('PaymentService: JOIN query failed, trying simple query:', error.message)
        
        let simpleQuery = supabase
          .from(TABLES.ORDERS)
          .select('*')
          .eq('payment_status', 'uploaded')
          .order('created_at', { ascending: false })

        // Apply pagination
        if (options.page && options.limit) {
          const from = (options.page - 1) * options.limit
          const to = from + options.limit - 1
          simpleQuery = simpleQuery.range(from, to)
        } else if (options.limit) {
          simpleQuery = simpleQuery.limit(options.limit)
        }

        const { data: simpleData, error: simpleError } = await simpleQuery

        if (simpleError) {
          console.error('PaymentService: Simple query also failed:', simpleError)
          return { orders: [], error: simpleError.message }
        }

        // Manually fetch user data for each order
        const ordersWithUsers = await Promise.all(
          (simpleData || []).map(async (order) => {
            // Fetch user data
            const { data: userData } = await supabase
              .from(TABLES.USERS)
              .select('full_name, email')
              .eq('id', order.user_id)
              .single()

            // Fetch order items
            const { data: itemsData } = await supabase
              .from('order_items')
              .select('*, products(name, category)')
              .eq('order_id', order.id)

            return {
              ...order,
              users: userData || { full_name: 'Unknown', email: 'unknown@example.com' },
              order_items: itemsData || []
            }
          })
        )

        return { orders: ordersWithUsers, error: null }
      }

      return { orders: data || [], error: null }
    } catch (err) {
      console.error('PaymentService: Unexpected error:', err)
      return { orders: [], error: err.message }
    }
  }

  /**
   * Get payment history for user
   * @returns {Promise<{payments, error}>}
   */
  static async getUserPaymentHistory() {
    try {
      const { user } = await AuthService.getCurrentUser()
      if (!user) {
        return { payments: [], error: 'User must be logged in' }
      }

      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select(`
          id,
          total_amount,
          payment_method,
          payment_status,
          payment_proof_url,
          payment_confirmed_at,
          payment_notes,
          created_at,
          status
        `)
        .eq('user_id', user.id)
        .not('payment_status', 'is', null)
        .order('created_at', { ascending: false })

      if (error) {
        return { payments: [], error: error.message }
      }

      return { payments: data || [], error: null }
    } catch (err) {
      return { payments: [], error: err.message }
    }
  }
}