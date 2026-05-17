import { ProductService } from '../../../lib/services/products'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    if (req.method === 'GET') {
      // Get single product
      const result = await ProductService.getProduct(id)
      
      if (result.error) {
        return res.status(404).json({
          success: false,
          error: { message: result.error }
        })
      }

      return res.status(200).json({
        success: true,
        data: { product: result.product },
        message: 'Product retrieved successfully'
      })

    } else {
      return res.status(405).json({
        success: false,
        error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }
      })
    }
  } catch (error) {
    console.error('Product API error:', error)
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    })
  }
}