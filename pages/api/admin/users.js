import { AdminService } from '../../../lib/services/admin'
import { AuthService } from '../../../lib/services/auth'

export default async function handler(req, res) {
  try {
    // Verify admin authentication
    const { user, profile } = await AuthService.getCurrentUser()
    
    if (!user || !profile || profile.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      })
    }

    if (req.method === 'GET') {
      // Get all users
      const { page = 1, limit = 20 } = req.query
      const { users, error } = await AdminService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit)
      })

      if (error) {
        return res.status(500).json({
          success: false,
          error: error
        })
      }

      return res.status(200).json({
        success: true,
        data: users
      })

    } else if (req.method === 'PATCH') {
      // Update user role
      const { userId, role } = req.body

      if (!userId || !role) {
        return res.status(400).json({
          success: false,
          error: 'User ID and role are required'
        })
      }

      const { user: updatedUser, error } = await AdminService.updateUserRole(userId, role)

      if (error) {
        return res.status(400).json({
          success: false,
          error: error
        })
      }

      return res.status(200).json({
        success: true,
        data: updatedUser
      })

    } else if (req.method === 'DELETE') {
      // Delete user
      const { userId } = req.body

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        })
      }

      const { success, error } = await AdminService.deleteUser(userId)

      if (error) {
        return res.status(400).json({
          success: false,
          error: error
        })
      }

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      })

    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }

  } catch (error) {
    console.error('Admin users API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}