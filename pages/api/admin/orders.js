import { AdminService } from '../../../lib/services/admin'
import { AuthService } from '../../../lib/services/auth'

export default async function handler(req, res) {
  // Only allow GET requests for now
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    // Verify admin authentication
    const { user, profile } = await AuthService.getCurrentUser()
    
    if (!user || !profile || profile.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      })
    }

    // Get all orders
    const { page = 1, limit = 20, status } = req.query
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    }

    if (status) {
      options.status = status
    }

    const { orders, error } = await AdminService.getAllOrders(options)

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    return res.status(200).json({
      success: true,
      data: orders
    })

  } catch (error) {
    console.error('Admin orders API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}