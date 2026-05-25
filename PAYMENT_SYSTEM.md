# Payment System Documentation

## Overview
CineGraph menggunakan sistem pembayaran manual dengan upload bukti pembayaran yang dikonfirmasi oleh admin. Sistem ini memberikan fleksibilitas untuk berbagai metode pembayaran lokal Indonesia.

## Payment Flow

### 1. User Checkout Process
```
Cart → Checkout → Order Created → Payment Modal → Upload Proof → Admin Confirmation
```

### 2. Payment Status Flow
```
pending → uploaded → confirmed/rejected
```

### 3. Order Status Flow
```
pending → awaiting_payment → confirmed → shipped → delivered
```

## Database Schema

### Orders Table Extensions
```sql
-- Payment-related columns added to orders table
payment_proof_url TEXT                    -- URL to uploaded payment proof
payment_method TEXT                       -- bank_transfer, e_wallet, credit_card
payment_status TEXT DEFAULT 'pending'    -- pending, uploaded, confirmed, rejected
payment_confirmed_at TIMESTAMP           -- When admin confirmed payment
payment_confirmed_by UUID                -- Admin who confirmed payment
payment_notes TEXT                       -- Admin notes for payment
```

### Payment Status Values
- **pending**: User hasn't uploaded payment proof yet
- **uploaded**: User uploaded proof, waiting for admin review
- **confirmed**: Admin approved the payment
- **rejected**: Admin rejected the payment

### Payment Methods
- **bank_transfer**: Transfer Bank (BCA, Mandiri, BRI, etc.)
- **e_wallet**: E-Wallet (GoPay, OVO, DANA, etc.)
- **credit_card**: Kartu Kredit
- **cash_on_delivery**: Bayar di Tempat (future feature)

## Components

### 1. PaymentModal Component
**Location**: `components/PaymentModal.js`

**Features**:
- Payment method selection
- File upload for payment proof (max 5MB, images only)
- Image preview before upload
- Payment instructions display
- Form validation

**Props**:
```javascript
{
  isOpen: boolean,
  onClose: function,
  orderData: { id, total },
  onPaymentSubmit: function
}
```

### 2. AdminProtection Component
**Location**: `components/AdminProtection.js`

**Features**:
- Wraps admin pages to ensure only admins can access
- Automatic redirect for unauthorized users
- Loading states and error handling

## Services

### 1. PaymentService
**Location**: `lib/services/payment.js`

**Methods**:
- `uploadPaymentProof(orderId, paymentData)` - Upload payment proof
- `confirmPayment(orderId, approved, notes)` - Admin confirm payment
- `getOrdersAwaitingPayment(options)` - Get orders needing confirmation
- `getUserPaymentHistory()` - Get user's payment history

### 2. AdminService Extensions
**Location**: `lib/services/admin.js`

**New Methods**:
- Dashboard statistics include payment data
- Order management includes payment status

## API Endpoints

### User Endpoints
- `POST /api/payment/upload` - Upload payment proof

### Admin Endpoints
- `GET /api/admin/payment-confirmations` - Get orders awaiting confirmation
- `POST /api/admin/payment-confirmations` - Confirm/reject payment

## Storage

### Payment Proofs Bucket
**Bucket**: `payment-proofs`
**Access**: Public read (for admin review)

**Policies**:
- Users can upload their own payment proofs
- Admins can view all payment proofs
- Admins can delete payment proofs

## Pages

### 1. Cart Page (Updated)
**Location**: `app/cart/page.js`

**Changes**:
- Shows PaymentModal after successful checkout
- Handles payment proof submission
- Redirects to profile after payment upload

### 2. Profile Page (Updated)
**Location**: `app/profile/page.js`

**Changes**:
- Displays payment status for each order
- Shows both order status and payment status
- Color-coded status indicators

### 3. Admin Payment Confirmations
**Location**: `app/dashboard/payments/page.js`

**Features**:
- List orders awaiting payment confirmation
- View payment proof images
- Approve/reject payments with notes
- Real-time order updates

### 4. Admin Dashboard (Updated)
**Location**: `app/dashboard/page.js`

**Changes**:
- Added payment confirmations link in navigation
- Added payment management quick action
- Statistics include payment data

## Security Features

### 1. File Upload Security
- File type validation (images only)
- File size limit (5MB)
- Secure file naming with timestamps
- Public URL generation for admin review

### 2. Access Control
- Users can only upload proofs for their own orders
- Admins can view all payment proofs
- Role-based API endpoint protection

### 3. Data Validation
- Payment method validation
- Order ownership verification
- Admin role verification for confirmations

## Payment Instructions

### Bank Transfer
- **BCA**: 1234567890 a.n. CineGraph Store
- **Mandiri**: 1234567890 a.n. CineGraph Store
- **BRI**: 1234567890 a.n. CineGraph Store

### E-Wallet
- **GoPay/OVO/DANA**: 081234567890 a.n. CineGraph Store

### Credit Card
- Manual processing through admin panel

## User Experience Flow

### 1. Checkout Process
1. User adds items to cart
2. User clicks "Beli Sekarang"
3. System creates order with status 'pending'
4. PaymentModal opens automatically
5. User selects payment method
6. User uploads payment proof
7. Order status changes to 'awaiting_payment'
8. User redirected to profile page

### 2. Admin Confirmation Process
1. Admin navigates to Dashboard → Pembayaran
2. Admin sees list of orders awaiting confirmation
3. Admin clicks "Lihat Bukti" to view payment proof
4. Admin clicks "Konfirmasi" to approve/reject
5. Admin adds optional notes
6. System updates order and payment status
7. User can see updated status in profile

## Error Handling

### Upload Errors
- File too large: "Ukuran file maksimal 5MB"
- Invalid file type: "Hanya file gambar yang diperbolehkan"
- Network error: "Gagal mengirim bukti pembayaran"

### Admin Errors
- Unauthorized access: Redirect to login
- Order not found: Error message display
- Confirmation failure: Retry option

## Future Enhancements

### 1. Automatic Payment Integration
- Payment gateway integration (Midtrans, Xendit)
- Real-time payment status updates
- Automatic order confirmation

### 2. Notification System
- Email notifications for payment status
- WhatsApp notifications
- Push notifications

### 3. Payment Analytics
- Payment method statistics
- Confirmation time analytics
- Revenue tracking

### 4. Mobile Optimization
- Camera integration for proof upload
- Mobile-optimized payment flow
- Offline payment support

## Testing

### Manual Testing Checklist
- [ ] User can upload payment proof
- [ ] Admin can view payment proofs
- [ ] Admin can confirm payments
- [ ] Admin can reject payments
- [ ] Order status updates correctly
- [ ] Payment status displays in profile
- [ ] File upload validation works
- [ ] Access control works properly

### Security Testing
- [ ] Users cannot access other users' orders
- [ ] Non-admins cannot access admin endpoints
- [ ] File upload security works
- [ ] SQL injection prevention
- [ ] XSS prevention

## Deployment Notes

### Database Migration
1. Run `database/add-payment-proof.sql`
2. Run `database/payment-storage-setup.sql`
3. Verify RLS policies are active

### Storage Setup
1. Create `payment-proofs` bucket in Supabase
2. Configure bucket policies
3. Test file upload functionality

### Environment Variables
No additional environment variables required - uses existing Supabase configuration.

## Troubleshooting

### Common Issues
1. **File upload fails**: Check storage bucket permissions
2. **Admin can't see proofs**: Verify RLS policies
3. **Payment status not updating**: Check API endpoint authentication
4. **Modal not showing**: Verify order creation success

### Debug Steps
1. Check browser console for errors
2. Verify Supabase storage configuration
3. Test API endpoints with admin credentials
4. Check database for payment status updates

The payment system provides a secure, user-friendly way to handle manual payment confirmations while maintaining proper access control and audit trails.