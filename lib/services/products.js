import { supabase, TABLES } from '../supabase'
import { AuthService } from './auth'

/**
 * Product Service
 * Handles all product-related operations including CRUD and catalog management
 */
export class ProductService {

  /**
   * Create a new product (admin only)
   * @param {Object} productData - Product information
   * @returns {Promise<{product, error}>}
   */
  static async createProduct(productData) {
    try {
      // Check admin permissions
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser.profile || currentUser.profile.role !== 'admin') {
        return { product: null, error: 'Unauthorized: Admin access required' }
      }

      // Validate required fields
      const { name, category, price, stock } = productData
      if (!name || !category || price === undefined || stock === undefined) {
        return { product: null, error: 'Missing required fields: name, category, price, stock' }
      }

      // Validate data types and constraints
      if (typeof price !== 'number' || price < 0) {
        return { product: null, error: 'Price must be a non-negative number' }
      }

      if (typeof stock !== 'number' || stock < 0) {
        return { product: null, error: 'Stock must be a non-negative number' }
      }

      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .insert([{
          name: name.trim(),
          category: category.trim(),
          description: productData.description?.trim() || null,
          price: parseFloat(price),
          stock: parseInt(stock),
          image_url: productData.image_url || null,
          specifications: productData.specifications || null,
          is_active: productData.is_active !== undefined ? productData.is_active : true
        }])
        .select()
        .single()

      if (error) {
        return { product: null, error: error.message }
      }

      return { product: data, error: null }
    } catch (err) {
      return { product: null, error: err.message }
    }
  }

  /**
   * Get products with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<{products, count, error}>}
   */
  static async getProducts(options = {}) {
    try {
      let query = supabase.from(TABLES.PRODUCTS).select('*', { count: 'exact' })

      // Apply filters
      if (options.category) {
        query = query.eq('category', options.category)
      }

      if (options.is_active !== undefined) {
        query = query.eq('is_active', options.is_active)
      } else {
        // Default: only show active products for non-admin users
        const currentUser = await AuthService.getCurrentUser()
        if (!currentUser.profile || currentUser.profile.role !== 'admin') {
          query = query.eq('is_active', true)
        }
      }

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
      }

      if (options.min_price !== undefined) {
        query = query.gte('price', options.min_price)
      }

      if (options.max_price !== undefined) {
        query = query.lte('price', options.max_price)
      }

      // Apply sorting
      const sortBy = options.sort_by || 'created_at'
      const sortOrder = options.sort_order || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit
        const to = from + options.limit - 1
        query = query.range(from, to)
      } else if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error, count } = await query

      if (error) {
        return { products: [], count: 0, error: error.message }
      }

      return { products: data || [], count: count || 0, error: null }
    } catch (err) {
      return { products: [], count: 0, error: err.message }
    }
  }

  /**
   * Get single product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<{product, error}>}
   */
  static async getProduct(productId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('id', productId)
        .single()

      if (error) {
        return { product: null, error: error.message }
      }

      return { product: data, error: null }
    } catch (err) {
      return { product: null, error: err.message }
    }
  }
}