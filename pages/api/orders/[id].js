import { OrderService } from '../../../lib/services/orders'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    if (req.method === 'GET') {
      // Get single order
      const result = await OrderService.getOrder(id)

      if (result.error) {
        return res.status(400).json({ error: result.error })
      }

      return res.status(200).json({ 
        order: result.order 
      })

    } else if (req.method === 'PATCH') {
      // Update order status (admin only)
      const { status } = req.body

      if (!status) {
        return res.status(400).json({ 
          error: 'Status is required' 
        })
      }

      const result = await OrderService.updateOrderStatus(id, status)

      if (result.error) {
        return res.status(400).json({ error: result.error })
      }

      return res.status(200).json({ 
        message: 'Order status updated successfully',
        order: result.order 
      })

    } else {
      res.setHeader('Allow', ['GET', 'PATCH'])
      return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }

  } catch (error) {
    console.error('Order API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}