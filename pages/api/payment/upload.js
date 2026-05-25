import { PaymentService } from '../../../lib/services/payment'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const { orderId, paymentData } = req.body

    if (!orderId || !paymentData) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and payment data are required'
      })
    }

    const result = await PaymentService.uploadPaymentProof(orderId, paymentData)

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Payment proof uploaded successfully'
      })
    } else {
      return res.status(400).json({
        success: false,
        error: result.error
      })
    }

  } catch (error) {
    console.error('Payment upload API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}