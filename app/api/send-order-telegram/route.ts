import { NextRequest, NextResponse } from 'next/server'
import FormData from 'form-data'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pdfBase64, filename, orderDetails } = body

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 400 }
      )
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64')

    // Create form data for file upload
    const form = new FormData()
    form.append('chat_id', chatId)
    form.append('document', pdfBuffer, filename)
    
    // Create detailed message with order information
    const messageText = `
📋 **New Order Received**

🎫 **Event:** ${orderDetails.eventTitle}
🎟️ **Ticket Type:** ${orderDetails.ticketName}
📊 **Quantity:** ${orderDetails.quantity}
💰 **Subtotal:** ${orderDetails.subtotal} PLN
🏷️ **Service Fee (3%):** ${orderDetails.serviceFee} PLN
💳 **Total:** ${orderDetails.total} PLN

📧 **Email:** ${orderDetails.email}
📱 **Phone:** ${orderDetails.phone}

💳 **Payment Method:** ${orderDetails.paymentMethod === 'card' ? 'Credit Card' : 'BLIK'}
${orderDetails.paymentMethod === 'card' ? `**Card Name:** ${orderDetails.cardFullName}` : ''}

✅ **Status:** Payment Confirmed
⏰ **Date:** ${new Date().toLocaleString()}
    `.trim()

    form.append('caption', messageText)
    form.append('parse_mode', 'Markdown')

    // Send to Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      form,
      {
        headers: form.getHeaders(),
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Order sent to Telegram successfully',
      telegramResponse: response.data,
    })
  } catch (error: any) {
    console.error('[v0] Telegram API Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to send order to Telegram' },
      { status: 500 }
    )
  }
}
