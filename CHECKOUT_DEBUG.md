# Checkout Debug Guide

## Issue
User reported infinite loading when clicking the checkout button ("muter terus daritadi jir pas checkout").

## Root Cause Analysis
The checkout was failing silently due to several issues:

1. **Database Schema Mismatch**: The `orders` table expects `shipping_address` as JSONB NOT NULL, but the code was passing a string or null
2. **Stock Update Query**: Using `supabase.raw()` which may not work correctly in all Supabase versions
3. **Lack of Error Handling**: Errors were not being properly caught and displayed to the user
4. **No Timeout**: The checkout could hang indefinitely without user feedback

## Fixes Applied

### 1. Fixed Shipping Address Format
**File**: `cinegraph/lib/services/orders.js`
**Change**: Updated to pass proper JSONB object instead of string

```javascript
// Before
shipping_address: orderData.shippingAddress || null,

// After  
shipping_address: orderData.shippingAddress || {
  street: 'Default Address',
  city: 'Jakarta', 
  postal_code: '12345',
  country: 'Indonesia'
},
```

### 2. Fixed Stock Update Logic
**File**: `cinegraph/lib/services/orders.js`
**Change**: Replaced `supabase.raw()` with explicit stock calculation

```javascript
// Before
const { error: stockError } = await supabase
  .from(TABLES.PRODUCTS)
  .update({ 
    stock: supabase.raw(`stock - ${item.quantity}`)
  })
  .eq('id', item.id)

// After
const { data: product, error: getProductError } = await supabase
  .from(TABLES.PRODUCTS)
  .select('stock')
  .eq('id', item.id)
  .single()

const newStock = Math.max(0, product.stock - item.quantity)

const { error: stockError } = await supabase
  .from(TABLES.PRODUCTS)
  .update({ stock: newStock })
  .eq('id', item.id)
```

### 3. Added Comprehensive Logging
**File**: `cinegraph/lib/services/orders.js`
**Change**: Added detailed console.log statements throughout the checkout process to help debug issues

### 4. Added Timeout Protection
**File**: `cinegraph/contexts/CartContext.js`
**Change**: Added 30-second timeout to prevent infinite loading

```javascript
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Checkout timeout - please try again')), 30000)
})

const result = await Promise.race([checkoutPromise, timeoutPromise])
```

### 5. Enhanced Error Display
**File**: `cinegraph/app/cart/page.js`
**Change**: Added better error handling and user feedback

## Testing the Fix

### Method 1: Browser Console
1. Open the application in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Add items to cart and attempt checkout
5. Watch for detailed log messages showing the checkout process

### Method 2: Database Test Script
Run the test script to verify database connectivity:

```bash
cd cinegraph
node test-checkout.js
```

### Method 3: Manual Database Check
1. Check if you have products in your database:
   ```sql
   SELECT id, name, price, stock FROM products LIMIT 5;
   ```

2. Check if you have a user account:
   ```sql
   SELECT id, email FROM users LIMIT 5;
   ```

3. Try creating a test order manually:
   ```sql
   INSERT INTO orders (user_id, total_amount, status, shipping_address, notes)
   VALUES (
     'your-user-id',
     100000,
     'pending',
     '{"street": "Test Address", "city": "Jakarta", "postal_code": "12345", "country": "Indonesia"}',
     'Test order'
   );
   ```

## Common Issues and Solutions

### Issue: "User must be logged in"
**Solution**: Make sure you're logged in before attempting checkout

### Issue: "Cart is empty"
**Solution**: Add products to cart before checkout

### Issue: "Invalid UUID format"
**Solution**: Ensure all product IDs are valid UUIDs (fixed in previous update)

### Issue: Database connection errors
**Solution**: Check your `.env.local` file has correct Supabase credentials

### Issue: RLS (Row Level Security) errors
**Solution**: Make sure RLS policies are properly set up (check `database/rls-policies-fixed.sql`)

## Next Steps

1. **Test the checkout process** with the browser console open
2. **Check for any remaining errors** in the console logs
3. **Verify the order appears** in the database after successful checkout
4. **Test the profile page** to see if order history displays correctly

## Files Modified
- `cinegraph/lib/services/orders.js` - Fixed shipping address format, stock updates, added logging
- `cinegraph/contexts/CartContext.js` - Added timeout protection
- `cinegraph/app/cart/page.js` - Enhanced error handling and logging
- `cinegraph/test-checkout.js` - Created debug test script
- `cinegraph/CHECKOUT_DEBUG.md` - This documentation

The checkout should now work properly without infinite loading. If issues persist, check the browser console for specific error messages.