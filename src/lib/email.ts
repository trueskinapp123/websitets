import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || 'your_resend_api_key');

export interface OrderEmailData {
  to: string;
  subject: string;
  order: {
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
    items: Array<{
      id: string;
      orderId: string;
      productId: string;
      quantity: number;
      price: number;
      createdAt: string;
    }>;
    createdAt: string;
  };
}

export const sendOrderConfirmation = async (orderData: OrderEmailData): Promise<boolean> => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TrueSkin <orders@trueskin.com>',
      to: [orderData.to],
      subject: orderData.subject,
      html: generateOrderEmailHTML(orderData),
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    console.log('Order confirmation email sent:', data);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

const generateOrderEmailHTML = (orderData: OrderEmailData): string => {
  const itemsHTML = orderData.order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Product ID: ${item.productId}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order - TrueSkin</title>
    </head>
    <body style="font-family: 'Lato', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #306b59 0%, #1e4d3a 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">New Order Received!</h1>
        <p style="color: #f3f4f6; margin: 10px 0 0 0; font-size: 16px;">Order #${orderData.order.id}</p>
      </div>

      <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
        <h2 style="color: #306b59; margin: 0 0 20px 0; font-size: 20px;">Customer Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <strong>Name:</strong><br>
            ${orderData.order.customerName}
          </div>
          <div>
            <strong>Email:</strong><br>
            ${orderData.order.customerEmail}
          </div>
          <div>
            <strong>Phone:</strong><br>
            ${orderData.order.customerPhone}
          </div>
          <div>
            <strong>Order Date:</strong><br>
            ${new Date(orderData.order.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div style="margin-top: 15px;">
          <strong>Shipping Address:</strong><br>
          ${orderData.order.shippingAddress.street}<br>
          ${orderData.order.shippingAddress.city}, ${orderData.order.shippingAddress.state} ${orderData.order.shippingAddress.zip}
        </div>
      </div>

      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 25px;">
        <h2 style="color: #306b59; margin: 0; padding: 20px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">Order Items</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; font-weight: bold; color: #374151;">Product</th>
              <th style="padding: 12px; text-align: center; font-weight: bold; color: #374151;">Qty</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; color: #374151;">Price</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; color: #374151;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <div style="background: #f9fafb; padding: 25px; border-radius: 8px; text-align: right;">
        <div style="font-size: 24px; font-weight: bold; color: #306b59;">
          Total Amount: ₹${orderData.order.totalAmount.toFixed(2)}
        </div>
        <div style="color: #6b7280; margin-top: 5px;">
          Payment Status: <span style="color: #059669; font-weight: bold;">PENDING</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          This order was placed through the TrueSkin website.<br>
          Please process and ship the order as soon as possible.
        </p>
      </div>
    </body>
    </html>
  `;
};

export default resend;
