import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD // App password for Gmail
    }
  })
}
const emailTemplates = {
  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmation - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1>🎉 Booking Confirmed!</h1>
          <h2>GoAdventureGo</h2>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Dear ${booking.user.firstName} ${booking.user.lastName},</h2>
          <p>Your booking has been confirmed! Here are the details:</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea;">Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Package:</strong> ${booking.package.name}</p>
            <p><strong>Destination:</strong> ${booking.package.destination.city}, ${booking.package.destination.country}</p>
            <p><strong>Travel Dates:</strong> ${new Date(booking.travelDates.startDate).toDateString()} to ${new Date(booking.travelDates.endDate).toDateString()}</p>
            <p><strong>Travelers:</strong> ${booking.travelers.length} person(s)</p>
            <p><strong>Total Amount:</strong> ₹${booking.pricing.totalPrice.toLocaleString()}</p>
            <p><strong>Status:</strong> ${booking.status.toUpperCase()}</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea;">What's Next?</h3>
            <ul>
              <li>You will receive your travel documents 7 days before departure</li>
              <li>Our travel expert will contact you within 24 hours</li>
              <li>Keep your booking ID handy for all communications</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/bookings/${booking._id}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Booking Details
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; text-align: center; padding: 20px;">
          <p>Need help? Contact us at support@goadventurego.com or +91-XXX-XXX-XXXX</p>
          <p>© 2025 GoAdventureGo. All rights reserved.</p>
        </div>
      </div>
    `
  }),
  paymentConfirmation: (booking, paymentDetails) => ({
    subject: `Payment Received - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 30px; text-align: center; color: white;">
          <h1>💳 Payment Received!</h1>
          <h2>GoAdventureGo</h2>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Dear ${booking.user.firstName},</h2>
          <p>We have successfully received your payment for booking ${booking.bookingId}.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #22c55e;">Payment Details</h3>
            <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
            <p><strong>Amount Paid:</strong> ₹${paymentDetails.amount.toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${paymentDetails.method.toUpperCase()}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>Your booking is now confirmed and we're excited to make your travel dreams come true!</p>
        </div>
        <div style="background: #333; color: white; text-align: center; padding: 20px;">
          <p>GoAdventureGo - Creating Memories That Last Forever</p>
        </div>
      </div>
    `
  }),
  bookingCancellation: (booking) => ({
    subject: `Booking Cancelled - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f87171 0%, #ef4444 100%); padding: 30px; text-align: center; color: white;">
          <h1>❌ Booking Cancelled</h1>
          <h2>GoAdventureGo</h2>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Dear ${booking.user.firstName},</h2>
          <p>We're sorry to confirm that your booking ${booking.bookingId} has been cancelled.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #ef4444;">Cancellation Details</h3>
            <p><strong>Cancellation Reason:</strong> ${booking.cancellation?.reason || 'Not specified'}</p>
            <p><strong>Refund Amount:</strong> ₹${booking.cancellation?.refundAmount?.toLocaleString() || '0'}</p>
            <p><strong>Refund Status:</strong> ${booking.cancellation?.refundStatus?.toUpperCase() || 'PENDING'}</p>
          </div>
          <p>If a refund is applicable, it will be processed within 5-7 business days.</p>
        </div>
        <div style="background: #333; color: white; text-align: center; padding: 20px;">
          <p>We hope to serve you again in the future!</p>
        </div>
      </div>
    `
  })
}
export const emailService = {
  sendBookingConfirmation: async (booking) => {
    try {
      const transporter = createTransporter()
      const template = emailTemplates.bookingConfirmation(booking)
      await transporter.sendMail({
        from: `"GoAdventureGo" <${process.env.EMAIL_USERNAME}>`,
        to: booking.user.email,
        subject: template.subject,
        html: template.html
      })
      return { success: true }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }
  },
  sendPaymentConfirmation: async (booking, paymentDetails) => {
    try {
      const transporter = createTransporter()
      const template = emailTemplates.paymentConfirmation(booking, paymentDetails)
      await transporter.sendMail({
        from: `"GoAdventureGo" <${process.env.EMAIL_USERNAME}>`,
        to: booking.user.email,
        subject: template.subject,
        html: template.html
      })
      return { success: true }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }
  },
  sendCancellationConfirmation: async (booking) => {
    try {
      const transporter = createTransporter()
      const template = emailTemplates.bookingCancellation(booking)
      await transporter.sendMail({
        from: `"GoAdventureGo" <${process.env.EMAIL_USERNAME}>`,
        to: booking.user.email,
        subject: template.subject,
        html: template.html
      })
      return { success: true }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }
  },
  sendCustomEmail: async (to, subject, htmlContent) => {
    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: `"GoAdventureGo" <${process.env.EMAIL_USERNAME}>`,
        to,
        subject,
        html: htmlContent
      })
      return { success: true }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }
  }
}
export default emailService
