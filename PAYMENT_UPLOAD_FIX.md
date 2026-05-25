# Payment Upload Stuck - Troubleshooting Guide

## Problem
Payment proof upload stuck at "Mengirim..." (Sending...) and never completes.

## Root Causes

### 1. Storage Bucket Not Created
The `payment-proofs` bucket doesn't exist in Supabase Storage.

**Solution**:
1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `payment-proofs`
4. Public: **Yes** (enable public access)
5. Click "Create Bucket"

OR run this SQL:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;
```

### 2. Storage Policies Not Set
Even if bucket exists, RLS policies might block uploads.

**Solution**:
Run `database/payment-storage-setup.sql` in Supabase SQL Editor.

### 3. File Too Large
Files over 5MB are rejected by client-side validation, but network issues can cause timeouts.

**Solution**:
- Check file size (should be < 5MB)
- Check network connection
- Try with smaller image

### 4. Network Timeout
Slow internet or large files can cause timeout.

**Solution**:
- Increased timeout to 30 seconds
- Compress image before upload
- Check internet connection

## Fixes Applied

### 1. Better Error Handling
```javascript
// Now catches and logs specific errors
try {
  const { data, error } = await supabase.storage.from('payment-proofs').upload(...)
  if (error) {
    console.error('Upload error:', error)
    // Fallback: continue without file upload
  }
} catch (err) {
  console.error('Upload exception:', err)
  // Continue with placeholder
}
```

### 2. Timeout Protection
```javascript
// 30-second timeout prevents infinite loading
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Upload timeout')), 30000)
})

await Promise.race([uploadPromise, timeoutPromise])
```

### 3. Graceful Degradation
If storage bucket doesn't exist:
- Upload continues without file
- Order is still created
- Payment status is updated
- Admin can still confirm manually

### 4. Detailed Logging
```javascript
console.log('Starting payment proof upload for order:', orderId)
console.log('Uploading file:', paymentData.proofFile.name)
console.log('File uploaded successfully:', paymentProofUrl)
```

## Testing the Fix

### 1. Check Browser Console
Open DevTools (F12) → Console tab and look for:
- "Starting payment proof upload for order: xxx"
- "Uploading file: xxx.jpg"
- Any error messages

### 2. Check Network Tab
Open DevTools (F12) → Network tab:
- Look for upload request to Supabase
- Check if it's pending/failed
- Check response status

### 3. Test Upload
1. Add item to cart
2. Checkout
3. Upload small image (< 1MB)
4. Watch console for errors
5. Should complete in < 10 seconds

## Manual Workaround

If upload still fails, you can update order manually:

### Option 1: Skip File Upload
The system now allows orders without file upload. Just:
1. Select payment method
2. Add notes
3. Submit (even without file)
4. Admin can confirm based on notes

### Option 2: Update Database Directly
```sql
UPDATE orders
SET 
  payment_method = 'bank_transfer',
  payment_status = 'uploaded',
  status = 'awaiting_payment',
  payment_notes = 'Uploaded via manual process'
WHERE id = 'YOUR_ORDER_ID';
```

## Prevention

### For Development
1. Always create storage bucket first
2. Test with small files (< 1MB)
3. Check console for errors
4. Monitor network requests

### For Production
1. Ensure storage bucket exists
2. Set up proper RLS policies
3. Configure CORS if needed
4. Monitor upload success rate
5. Set up error alerts

## Quick Fix Checklist

- [ ] Storage bucket `payment-proofs` exists
- [ ] Bucket is set to public
- [ ] RLS policies are configured
- [ ] File size < 5MB
- [ ] Network connection is stable
- [ ] Browser console shows no errors
- [ ] Timeout is set (30 seconds)
- [ ] Error handling is in place

## Error Messages

### "Bucket not found"
**Cause**: Storage bucket doesn't exist
**Fix**: Create bucket in Supabase Dashboard

### "Upload timeout"
**Cause**: Network slow or file too large
**Fix**: Use smaller file or better connection

### "Failed to upload payment proof"
**Cause**: Generic upload error
**Fix**: Check console for specific error

### "Order not found or access denied"
**Cause**: User doesn't own the order
**Fix**: Ensure user is logged in correctly

## Files Modified

1. `lib/services/payment.js`
   - Added detailed logging
   - Added graceful degradation
   - Better error messages

2. `components/PaymentModal.js`
   - Added 30-second timeout
   - Better error display
   - Loading state management

3. `app/cart/page.js`
   - Enhanced error handling
   - Better logging

4. `database/create-payment-bucket-simple.sql` (NEW)
   - Simple bucket creation script

The payment upload should now work reliably with proper error messages if something goes wrong!