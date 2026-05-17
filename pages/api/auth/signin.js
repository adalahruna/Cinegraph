import { AuthService } from '../../../lib/services/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }
    })
  }

  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      })
    }

    const result = await AuthService.signIn(email, password)

    if (result.error) {
      return res.status(400).json({
        success: false,
        error: { message: result.error }
      })
    }

    return res.status(200).json({
      success: true,
      data: { 
        user: result.user,
        session: result.session,
        profile: result.profile
      },
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Signin error:', error)
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    })
  }
}