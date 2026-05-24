// Simple test script to debug checkout functionality
// Run with: node test-checkout.js

const { createClient } = require('@supabase/supabase-js')

// Mock environment variables (replace with actual values for testing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url') {
  console.log('Please set your Supabase environment variables in .env.local')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to check database connection
async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .limit(3)
    
    if (productsError) {
      console.error('Products query error:', productsError)
      return false
    }
    
    console.log('Products found:', products?.length || 0)
    if (products && products.length > 0) {
      console.log('Sample product:', products[0])
    }
    
    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1)
    
    if (usersError) {
      console.error('Users query error:', usersError)
      return false
    }
    
    console.log('Users found:', users?.length || 0)
    
    // Test orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, total_amount')
      .limit(1)
    
    if (ordersError) {
      console.error('Orders query error:', ordersError)
      return false
    }
    
    console.log('Orders found:', orders?.length || 0)
    
    console.log('✅ Database connection successful!')
    return true
    
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// Test authentication
async function testAuth() {
  try {
    console.log('\nTesting authentication...')
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log('No authenticated user (this is normal for testing)')
      return null
    }
    
    if (user) {
      console.log('Authenticated user found:', user.id)
      return user
    }
    
    console.log('No user authenticated')
    return null
    
  } catch (error) {
    console.error('Auth test failed:', error)
    return null
  }
}

// Main test function
async function runTests() {
  console.log('🧪 CineGraph Checkout Debug Test\n')
  
  const dbConnected = await testDatabaseConnection()
  if (!dbConnected) {
    console.log('❌ Database connection failed. Please check your Supabase configuration.')
    return
  }
  
  const user = await testAuth()
  
  console.log('\n📋 Test Summary:')
  console.log('- Database connection:', dbConnected ? '✅' : '❌')
  console.log('- User authentication:', user ? '✅' : '⚠️  (No user logged in)')
  
  console.log('\n💡 Next steps:')
  console.log('1. Make sure you have products in your database')
  console.log('2. Create a user account and log in')
  console.log('3. Add products to cart and try checkout')
  console.log('4. Check browser console for detailed error messages')
}

runTests().catch(console.error)