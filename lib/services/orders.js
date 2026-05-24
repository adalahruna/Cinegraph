import { supabase, TABLES } from '../supabase'
import { AuthService } from './auth'

/**
 * Order Service
 * Handles all order-related operations including checkout and order history
 */
export class OrderService {

  /**
   * Create a new order (checkout process)
   * @param {Array} cartItems - Array of cart items
   * @param {Object} orderData - Order information
   * @returns {Promise<{order, error}>}
   */
  static async createOrder(cartItems, orderData = {}) {
    try {
      console.log('OrderService.createOrder called with:', { cartItems, orderData })
      
      // Check if user is authenticated
      const { user, profile } = await AuthService.getCurrentUser()
      console.log('Current user:', { user: user?.id, profile: profile?.id })
      
      if (!user || !profile) {
        console.error('User not authenticated:', { user: !!user, profile: !!profile })
        return { order: null, error: 'User must be logged in to place an order' }
      }

      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        console.error('Cart is empty')
        return { order: null, error: 'Cart is empty' }
      }

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shippingCost = orderData.shippingCost || 50000
      const finalTotal = totalAmount + shippingCost
      
      console.log('Order totals:', { totalAmount, shippingCost, finalTotal })

      // Prepare order data
      const orderInsertData = {
        user_id: user.id,
        total_amount: finalTotal,
        status: 'pending',
        shipping_address: orderData.shippingAddress || {
          street: 'Default Address',
          city: 'Jakarta',
          postal_code: '12345',
          country: 'Indonesia'
        },
        notes: orderData.notes || null
      }
      
      console.log('Inserting order with data:', orderInsertData)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from(TABLES.ORDERS)
        .insert([orderInsertData])
        .select()
        .single()

      if (orderError) {
        console.error('Order creation error:', orderError)
        return { order: null, error: orderError.message }
      }
      
      console.log('Order created successfully:', order)

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }))
      
      console.log('Inserting order items:', orderItems)

      const { error: itemsError } = await supabase
        .from(TABLES.ORDER_ITEMS)
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items creation error:', itemsError)
        // Rollback order if items creation fails
        await supabase.from(TABLES.ORDERS).delete().eq('id', order.id)
        return { order: null, error: itemsError.message }
      }
      
      console.log('Order items created successfully')

      // Update product stock
      for (const item of cartItems) {
        console.log(`Updating stock for product ${item.id}, reducing by ${item.quantity}`)
        
        // First get current stock
        const { data: product, error: getProductError } = await supabase
          .from(TABLES.PRODUCTS)
          .select('stock')
          .eq('id', item.id)
          .single()
          
        if (getProductError) {
          console.error(`Failed to get current stock for product ${item.id}:`, getProductError)
          continue
        }
        
        const newStock = Math.max(0, product.stock - item.quantity)
        
        const { error: stockError } = await supabase
          .from(TABLES.PRODUCTS)
          .update({ stock: newStock })
          .eq('id', item.id)

        if (stockError) {
          console.error(`Failed to update stock for product ${item.id}:`, stockError)
        } else {
          console.log(`Stock updated for product ${item.id}: ${product.stock} -> ${newStock}`)
        }
      }
      
      console.log('Order creation completed successfully')
      return { order, error: null }
    } catch (err) {
      console.error('OrderService.createOrder error:', err)
      return { order: null, error: err.message }
    }
  }

  /**
   * Get user's order history
   * @param {Object} options - Query options
   * @returns {Promise<{orders, error}>}
   */
  static async getUserOrders(options = {}) {
    try {
      const { user } = await AuthService.getCurrentUser()
      if (!user) {
        return { orders: [], error: 'User must be logged in' }
      }

      let query = supabase
        .from(TABLES.ORDERS)
        .select(`
          *,
          order_items (
            *,
            products (
              id,
              name,
              category,
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
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
        return { orders: [], error: error.message }
      }

      return { orders: data || [], error: null }
    } catch (err) {
      return { orders: [], error: err.message }
    }
  }

  /**
   * Get single order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<{order, error}>}
   */
  static async getOrder(orderId) {
    try {
      const { user } = await AuthService.getCurrentUser()
      if (!user) {
        return { order: null, error: 'User must be logged in' }
      }

      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select(`
          *,
          order_items (
            *,
            products (
              id,
              name,
              category,
              description,
              image_url
            )
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        return { order: null, error: error.message }
      }

      return { order: data, error: null }
    } catch (err) {
      return { order: null, error: err.message }
    }
  }

  /**
   * Update order status (admin only)
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<{order, error}>}
   */
  static async updateOrderStatus(orderId, status) {
    try {
      const { user, profile } = await AuthService.getCurrentUser()
      if (!user || !profile || profile.role !== 'admin') {
        return { order: null, error: 'Unauthorized: Admin access required' }
      }

      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .update({ status })
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        return { order: null, error: error.message }
      }

      return { order: data, error: null }
    } catch (err) {
      return { order: null, error: err.message }
    }
  }
}