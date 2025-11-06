// Email service using Resend API
import { Resend } from 'resend';
import { getApiUrl } from '../utils/apiUrl';

// Initialize Resend client only if API key is available
let resend: Resend | null = null;

const initializeResend = () => {
  if (!resend) {
    // Use environment variable first, fallback to provided API key if needed
    const apiKey = import.meta.env.VITE_RESEND_API_KEY || 're_LzohxFUg_MEqroxVFQ5F1CmDgEWvtkJzi';
    if (apiKey) {
      resend = new Resend(apiKey);
    }
  }
  return resend;
};

// Admin email address
const ADMIN_EMAIL = 'amaamafatima67@gmail.com';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  createdAt: string;
  paymentId?: string;
  razorpayOrderId?: string;
}

// Send order confirmation email to admin
export async function sendOrderConfirmationToAdmin(orderData: OrderEmailData): Promise<boolean> {
  try {
    const resendClient = initializeResend();
    if (!resendClient) {
      console.warn('Resend API key not configured. Email not sent.');
      return false;
    }

    // Format order items for email
    const itemsHtml = orderData.items.map((item, index) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${index + 1}</td>
        <td style="padding: 12px; text-align: left;">${item.productId}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 12px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #b66837 0%, #803716 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; color: #803716; }
          .detail-value { color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #803716; color: white; padding: 12px; text-align: left; }
          td { padding: 12px; }
          .total { background: #f3f4f6; font-weight: bold; font-size: 18px; color: #803716; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 New Order Received!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderData.id.slice(0, 8).toUpperCase()}</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚠️ Action Required:</strong> A new order has been placed and payment has been received. Please process this order immediately.
            </div>

            <div class="order-details">
              <h2 style="color: #803716; margin-top: 0;">📦 Order Information</h2>
              
              <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">${orderData.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                <span class="detail-value">${new Date(orderData.createdAt).toLocaleString()}</span>
              </div>
              ${orderData.paymentId ? `
              <div class="detail-row">
                <span class="detail-label">Payment ID:</span>
                <span class="detail-value">${orderData.paymentId}</span>
              </div>
              ` : ''}
              ${orderData.razorpayOrderId ? `
              <div class="detail-row">
                <span class="detail-label">Razorpay Order ID:</span>
                <span class="detail-value">${orderData.razorpayOrderId}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value" style="font-size: 20px; font-weight: bold; color: #803716;">₹${orderData.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div class="order-details">
              <h2 style="color: #803716; margin-top: 0;">👤 Customer Information</h2>
              
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${orderData.customerName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value"><a href="mailto:${orderData.customerEmail}">${orderData.customerEmail}</a></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value"><a href="tel:${orderData.customerPhone}">${orderData.customerPhone}</a></span>
              </div>
            </div>

            <div class="order-details">
              <h2 style="color: #803716; margin-top: 0;">📍 Shipping Address</h2>
              
              <p style="margin: 0; line-height: 1.8;">
                ${orderData.shippingAddress.street}<br>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}<br>
                ${orderData.shippingAddress.zip}
              </p>
            </div>

            <div class="order-details">
              <h2 style="color: #803716; margin-top: 0;">🛍️ Order Items</h2>
              
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product ID</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr class="total">
                    <td colspan="4" style="text-align: right; padding: 15px;">Total Amount:</td>
                    <td style="text-align: right; padding: 15px;">₹${orderData.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <strong>📋 Next Steps:</strong>
              <ol style="margin: 10px 0 0 20px; padding: 0;">
                <li>Review the order details</li>
                <li>Prepare the products for shipping</li>
                <li>Update the order status in the dashboard</li>
                <li>Ship the order to the customer</li>
              </ol>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated notification from TrueSkin E-commerce Platform</p>
            <p>© ${new Date().getFullYear()} TrueSkin. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resendClient.emails.send({
      from: 'TrueSkin Orders <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `🎉 New Order #${orderData.id.slice(0, 8).toUpperCase()} - ₹${orderData.totalAmount.toFixed(2)}`,
      html: emailHtml,
    });

    if (result.error) {
      console.error('Error sending email:', result.error);
      console.error('Error details:', JSON.stringify(result.error, null, 2));
      return false;
    }

    console.log('Order confirmation email sent to admin successfully');
    return true;
  } catch (error) {
    console.error('Error in sendOrderConfirmationToAdmin:', error);
    return false;
  }
}

// Send order confirmation email to customer
export async function sendOrderConfirmationToCustomer(orderData: OrderEmailData): Promise<boolean> {
  try {
    const resendClient = initializeResend();
    if (!resendClient) {
      console.warn('Resend API key not configured. Email not sent.');
      return false;
    }

    // Format order items for email
    const itemsHtml = orderData.items.map((item, index) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${index + 1}</td>
        <td style="padding: 12px; text-align: left;">${item.productId}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 12px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #b66837 0%, #803716 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; color: #803716; }
          .detail-value { color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #803716; color: white; padding: 12px; text-align: left; }
          td { padding: 12px; }
          .total { background: #f3f4f6; font-weight: bold; font-size: 18px; color: #803716; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✨ Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your order, ${orderData.customerName}!</p>
          </div>
          
          <div class="content">
            <div class="success">
              <strong>✅ Payment Successful!</strong> Your order has been confirmed and we're preparing it for shipment.
            </div>

            <div class="order-details">
              <h2 style="color: #803716; margin-top: 0;">📦 Order Information</h2>
              
              <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">${orderData.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                <span class="detail-value">${new Date(orderData.createdAt).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value" style="font-size: 20px; font-weight: bold; color: #803716;">₹${orderData.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div class="order-details">
              <h2 style="color: #803716; margin-top: 0;">🛍️ Order Items</h2>
              
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product ID</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr class="total">
                    <td colspan="4" style="text-align: right; padding: 15px;">Total Amount:</td>
                    <td style="text-align: right; padding: 15px;">₹${orderData.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="order-details">
              <h2 style="color: #803716; margin-top: 0;">📍 Shipping Address</h2>
              
              <p style="margin: 0; line-height: 1.8;">
                ${orderData.shippingAddress.street}<br>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}<br>
                ${orderData.shippingAddress.zip}
              </p>
            </div>

            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <strong>📬 What's Next?</strong>
              <ul style="margin: 10px 0 0 20px; padding: 0;">
                <li>We'll send you a tracking number once your order ships</li>
                <li>You can track your order status in your account</li>
                <li>Expected delivery: 3-5 business days</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with TrueSkin!</p>
            <p>If you have any questions, please contact us at amaamafatima67@gmail.com</p>
            <p>© ${new Date().getFullYear()} TrueSkin. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resendClient.emails.send({
      from: 'TrueSkin Orders <onboarding@resend.dev>',
      to: orderData.customerEmail,
      subject: `Order Confirmation #${orderData.id.slice(0, 8).toUpperCase()} - TrueSkin`,
      html: emailHtml,
    });

    if (result.error) {
      console.error('Error sending email:', result.error);
      console.error('Error details:', JSON.stringify(result.error, null, 2));
      return false;
    }

    console.log('Order confirmation email sent to customer successfully');
    return true;
  } catch (error) {
    console.error('Error in sendOrderConfirmationToCustomer:', error);
    return false;
  }
}

// Legacy function for backward compatibility
export async function sendOrderConfirmation(data: { to: string; subject: string; order: OrderEmailData }): Promise<boolean> {
  if (data.to === ADMIN_EMAIL) {
    return await sendOrderConfirmationToAdmin(data.order);
  } else {
    return await sendOrderConfirmationToCustomer(data.order);
  }
}

// Contact form email data interface
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Send contact form query to admin
export async function sendContactFormEmail(contactData: ContactFormData): Promise<boolean> {
  try {
    const apiUrl = getApiUrl();
    console.log('Sending contact form email to:', `${apiUrl}/api/send-contact-email`);
    
    const response = await fetch(`${apiUrl}/api/send-contact-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    const result = await response.json();
    console.log('Backend response:', { status: response.status, success: result.success, result });
    
    if (!response.ok || !result.success) {
      console.error('❌ Error sending contact form email:', {
        status: response.status,
        error: result.error,
        details: result.details
      });
      return false;
    }

    console.log('✅ Contact form email sent successfully');
    return true;


  } catch (error) {
    console.error('❌ Network/Fetch error in sendContactFormEmail:', error);
    return false;
  }
}

// Send auto-reply confirmation to customer
// Note: This is handled by the backend endpoint, but we keep this function for compatibility
export async function sendContactFormConfirmation(_contactData: ContactFormData): Promise<boolean> {
  // The backend sends both admin and customer emails, so this is already handled
  // Return true to indicate success since sendContactFormEmail handles both
  return true;
}