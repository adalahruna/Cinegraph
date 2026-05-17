import { AuthService } from '../../../lib/services/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }
    })
  }

  try {
    const { email, password, full_name, phone, address } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid email format' }
      })
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 6 characters long' }
      })
    }

    const result = await AuthService.signUp(email, password, {
      full_name,
      phone,
      address
    })

    if (result.error) {
      return res.status(400).json({
        success: false,
        error: { message: result.error }
      })
    }

    return res.status(201).json({
      success: true,
      data: { user: result.user },
      message: 'User registered successfully'
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    })
  }
}