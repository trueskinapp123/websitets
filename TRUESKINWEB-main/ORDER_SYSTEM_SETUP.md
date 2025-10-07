# TrueSkin Order System Setup Guide

This guide will help you set up the complete order placement system with image updates, email notifications, and cart management.

## 🚀 Quick Setup

### 1. Database Setup

Run the complete setup script in your Supabase SQL editor:

```sql
-- Run this in Supabase SQL Editor
\i complete-order-setup.sql
```

Or copy and paste the contents of `complete-order-setup.sql` into your Supabase SQL editor.

### 2. Environment Variables

Make sure you have these environment variables set in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RESEND_API_KEY=your_resend_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_ADMIN_EMAIL=amaamafatima67@gmail.com
```

### 3. Image Setup

Place your product images in the `public/images/` directory:
- `p4.png` - for Heal Pack (4 Masks)
- `p8.png` - for Fresh Pack (8 Masks)  
- `p12.png` - for Glow Pack (12 Masks)

## 📋 Features Implemented

### ✅ Product Image Updates
- Updated product images to use local files (p4.png, p8.png, p12.png)
- Removed old placeholder images
- Images are properly linked in the database

### ✅ Complete Order System
- **Order Creation**: Creates orders with customer details, shipping address, and items
- **Order Items**: Tracks individual products and quantities in each order
- **Order Status**: Supports pending, paid, failed, processing, shipped, delivered, cancelled
- **Payment Integration**: Works with Razorpay for secure payments

### ✅ Email Notifications
- **Admin Notifications**: Sends order details to `amaamafatima67@gmail.com`
- **Professional Email Template**: Beautiful HTML email with order details
- **Order Information**: Includes customer details, items, total amount, and shipping address
- **Theme Consistency**: Uses TrueSkin colors (#306b59 and white)

### ✅ Cart Management
- **Cart Clearing**: Automatically clears cart after successful order
- **Persistent Cart**: Cart data is stored in Supabase for logged-in users
- **Guest Support**: Supports both logged-in and guest users

### ✅ Authentication Integration
- **Login Required**: Users must be logged in to place orders
- **User Association**: Orders are tied to user accounts
- **Profile Integration**: Auto-fills customer details from user profile

## 🗄️ Database Schema

### Orders Table
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 API Endpoints

### Order Service Methods

```typescript
// Create a new order
orderService.createOrder(orderData: CreateOrderData): Promise<Order | null>

// Get orders for a user
orderService.getOrders(userId: string): Promise<Order[]>

// Get order by ID
orderService.getOrderById(orderId: string): Promise<Order | null>

// Update order status
orderService.updateOrderStatus(orderId: string, status: Order['status'], paymentId?: string): Promise<boolean>

// Clear user's cart
orderService.clearUserCart(userId: string): Promise<boolean>

// Send order confirmation email
orderService.sendOrderConfirmationEmail(order: Order, orderItems: OrderItem[]): Promise<boolean>
```

## 🎨 UI Components

### CheckoutForm
- **Location**: `src/components/CheckoutForm.tsx`
- **Features**: 
  - Customer information form
  - Shipping address form
  - Order summary
  - Payment processing
  - Google Sign-in integration
  - Form validation
  - Error handling

### OrderSuccess
- **Location**: `src/pages/OrderSuccess.tsx`
- **Features**:
  - Order confirmation display
  - Order details
  - Next steps information
  - Action buttons
  - Support contact info

## 📧 Email System

### Email Template
- **Recipient**: `amaamafatima67@gmail.com`
- **Subject**: "New Order Received - TrueSkin"
- **Content**: Professional HTML email with:
  - Order details
  - Customer information
  - Shipping address
  - Itemized order list
  - Total amount
  - Order date

### Email Service
- **Location**: `src/lib/email.ts`
- **Provider**: Resend (configurable)
- **Template**: Responsive HTML with TrueSkin branding

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only view their own orders
- Orders are protected by user authentication
- Guest orders are supported with proper validation

### Data Validation
- Form validation on frontend
- Server-side validation in database
- Payment amount validation
- Required field validation

## 🚀 Testing the System

### 1. Test Order Placement
1. Add products to cart
2. Go to checkout
3. Fill in customer details
4. Complete payment
5. Verify order creation in database
6. Check email notification

### 2. Test Cart Clearing
1. Place a successful order
2. Verify cart is empty
3. Check database cart tables are cleared

### 3. Test Authentication
1. Try to checkout without login (should show error)
2. Login and complete checkout
3. Verify order is associated with user

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Resend API key
   - Verify email service configuration
   - Check console for errors

2. **Order not creating**
   - Check user authentication
   - Verify database permissions
   - Check form validation

3. **Cart not clearing**
   - Check user ID
   - Verify cart service
   - Check database constraints

4. **Images not loading**
   - Verify image files exist in public/images/
   - Check image paths in database
   - Verify public folder structure

### Debug Steps

1. Check browser console for errors
2. Check Supabase logs
3. Verify environment variables
4. Test database queries directly
5. Check network requests

## 📝 Additional Notes

### Theme Colors
- Primary: #306b59 (dark green)
- Secondary: White
- Accent: #1e4d3a (darker green)

### File Structure
```
src/
├── components/
│   └── CheckoutForm.tsx
├── pages/
│   └── OrderSuccess.tsx
├── services/
│   └── orderService.ts
├── lib/
│   └── email.ts
└── types/
    └── database.ts
```

### Database Files
```
├── complete-order-setup.sql
├── update-product-images.sql
└── update-orders-schema.sql
```

## 🎉 Success!

Your TrueSkin order system is now fully functional with:
- ✅ Updated product images
- ✅ Complete order placement flow
- ✅ Email notifications
- ✅ Cart management
- ✅ Authentication integration
- ✅ Professional UI/UX
- ✅ Theme consistency

The system is ready for production use!
