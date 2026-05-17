import { ProductService } from '../../../lib/services/products'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get products with filtering and pagination
      const {
        category,
        search,
        min_price,
        max_price,
        is_active,
        sort_by,
        sort_order,
        page = 1,
        limit = 20
      } = req.query

      const options = {
        category,
        search,
        min_price: min_price ? parseFloat(min_price) : undefined,
        max_price: max_price ? parseFloat(max_price) : undefined,
        is_active: is_active !== undefined ? is_active === 'true' : undefined,
        sort_by,
        sort_order,
        page: parseInt(page),
        limit: parseInt(limit)
      }

      const result = await ProductService.getProducts(options)
      
      if (result.error) {
        return res.status(400).json({
          success: false,
          error: { message: result.error }
        })
      }

      return res.status(200).json({
        success: true,
        data: {
          products: result.products,
          count: result.count,
          page: options.page,
          limit: options.limit
        },
        message: 'Products retrieved successfully'
      })

    } else if (req.method === 'POST') {
      // Create new product (admin only)
      const productData = req.body

      // Validate required fields
      const { name, category, price, stock } = productData
      if (!name || !category || price === undefined || stock === undefined) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required fields: name, category, price, stock' }
        })
      }

      const result = await ProductService.createProduct(productData)
      
      if (result.error) {
        return res.status(400).json({
          success: false,
          error: { message: result.error }
        })
      }

      return res.status(201).json({
        success: true,
        data: { product: result.product },
        message: 'Product created successfully'
      })

    } else {
      return res.status(405).json({
        success: false,
        error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }
      })
    }
  } catch (error) {
    console.error('Products API error:', error)
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    })
  }
}