import { AdminService } from '../../../lib/services/admin'
import { AuthService } from '../../../lib/services/auth'

export default async function handler(req, res) {
  // Only allow GET requests
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

    // Get dashboard statistics
    const { stats, error } = await AdminService.getDashboardStats()

    if (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }

    return res.status(200).json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Admin stats API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}