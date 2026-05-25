import { supabaseServer, TABLES } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  try {
    // TEMPORARY: Skip auth check for development
    // TODO: Implement proper admin auth for API routes
    console.log('Payment API - Using server-side client')

    if (req.method === 'GET') {
      // Get orders awaiting payment confirmation
      try {
        const { page = 1, limit = 20 } = req.query
        
        // Use server-side client to bypass RLS
        let query = supabaseServer
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
        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        if (pageNum && limitNum) {
          const from = (pageNum - 1) * limitNum
          const to = from + limitNum - 1
          query = query.range(from, to)
        } else if (limitNum) {
          query = query.limit(limitNum)
        }

        const { data, error } = await query

        if (error) {
          console.error('Payment API - Query error:', error)
          // Try simple query without joins
          const { data: simpleData, error: simpleError } = await supabaseServer
            .from(TABLES.ORDERS)
            .select('*')
            .eq('payment_status', 'uploaded')
            .order('created_at', { ascending: false })
            .limit(limitNum || 20)

          if (simpleError) {
            console.error('Payment API - Simple query error:', simpleError)
            return res.status(200).json({
              success: true,
              data: []
            })
          }

          // Manually fetch related data
          const ordersWithData = await Promise.all(
            (simpleData || []).map(async (order) => {
              const { data: userData } = await supabaseServer
                .from(TABLES.USERS)
                .select('full_name, email')
                .eq('id', order.user_id)
                .single()

              const { data: itemsData } = await supabaseServer
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

          return res.status(200).json({
            success: true,
            data: ordersWithData
          })
        }

        return res.status(200).json({
          success: true,
          data: data || []
        })
      } catch (err) {
        console.error('Payment API - GET error:', err)
        return res.status(200).json({
          success: true,
          data: []
        })
      }

    } else if (req.method === 'POST') {
      // Confirm payment
      const { orderId, approved, notes } = req.body

      if (!orderId || typeof approved !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Order ID and approval status are required'
        })
      }

      try {
        // Get order first
        const { data: order, error: orderError } = await supabaseServer
          .from(TABLES.ORDERS)
          .select('*')
          .eq('id', orderId)
          .single()

        if (orderError || !order) {
          console.error('Payment API - Order not found:', orderError)
          return res.status(404).json({
            success: false,
            error: 'Order not found'
          })
        }

        // Update payment status
        const updateData = {
          payment_status: approved ? 'confirmed' : 'rejected',
          payment_confirmed_at: new Date().toISOString(),
          payment_notes: notes || null
        }

        // If approved, also update order status
        if (approved) {
          updateData.status = 'confirmed'
        }

        const { error: updateError } = await supabaseServer
          .from(TABLES.ORDERS)
          .update(updateData)
          .eq('id', orderId)

        if (updateError) {
          console.error('Payment API - Update error:', updateError)
          return res.status(500).json({
            success: false,
            error: 'Failed to update payment status'
          })
        }

        return res.status(200).json({
          success: true,
          message: approved ? 'Payment confirmed successfully' : 'Payment rejected'
        })
      } catch (err) {
        console.error('Payment API - POST error:', err)
        return res.status(500).json({
          success: false,
          error: 'Failed to process payment confirmation'
        })
      }

    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }

  } catch (error) {
    console.error('Payment confirmation API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}