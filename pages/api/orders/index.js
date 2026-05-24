import { OrderService } from '../../../lib/services/orders'

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Create new order
      const { cartItems, orderData } = req.body

      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ 
          error: 'Cart items are required and must be a non-empty array' 
        })
      }

      const result = await OrderService.createOrder(cartItems, orderData)

      if (result.error) {
        return res.status(400).json({ error: result.error })
      }

      return res.status(201).json({ 
        message: 'Order created successfully',
        order: result.order 
      })

    } else if (req.method === 'GET') {
      // Get user orders
      const { page, limit } = req.query
      
      const options = {}
      if (page) options.page = parseInt(page)
      if (limit) options.limit = parseInt(limit)

      const result = await OrderService.getUserOrders(options)

      if (result.error) {
        return res.status(400).json({ error: result.error })
      }

      return res.status(200).json({ 
        orders: result.orders 
      })

    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }

  } catch (error) {
    console.error('Orders API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}