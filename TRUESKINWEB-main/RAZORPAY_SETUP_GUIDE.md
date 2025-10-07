# Razorpay Payment Gateway Setup Guide

## 🚀 Quick Setup

### 1. Get Your Razorpay Credentials

1. **Sign up for Razorpay**: Go to [https://razorpay.com](https://razorpay.com) and create an account
2. **Get Test Credentials**: 
   - Go to Dashboard → Settings → API Keys
   - Copy your **Test Key ID** (starts with `rzp_test_`)
   - Copy your **Test Key Secret**

### 2. Environment Variables

Create a `.env` file in your project root with:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Test the Payment Flow

1. **Start your development server**: `npm run dev`
2. **Add products to cart**
3. **Go to checkout**
4. **Click "Pay Now"**
5. **You'll see the Razorpay payment modal**

## 💳 Payment Flow

### What Happens When You Click "Pay Now":

1. ✅ **Form Validation**: Checks all required fields
2. ✅ **Order Creation**: Creates order in database
3. ✅ **Razorpay Modal**: Opens Razorpay payment interface
4. ✅ **Payment Processing**: User completes payment
5. ✅ **Success Handling**: Updates order status and sends emails
6. ✅ **Redirect**: Takes user to success/failure page

### Test Payment Methods:

- **Card**: Use Razorpay test cards
  - Success: `4111 1111 1111 1111`
  - Failure: `4000 0000 0000 0002`
- **UPI**: Use any UPI ID
- **Net Banking**: Select any test bank
- **Wallet**: Use any test wallet

## 🔧 Configuration Options

### Customize Payment Modal:

The Razorpay modal is configured with:
- **Brand Colors**: Uses your TrueSkin theme (`#b66837`)
- **Company Name**: "TrueSkin"
- **Description**: "TrueSkin Bio Collagen Face Masks"
- **Prefill**: Customer details from checkout form

### Supported Payment Methods:

- ✅ Credit/Debit Cards
- ✅ UPI (Google Pay, PhonePe, Paytm)
- ✅ Net Banking
- ✅ Wallets (Paytm, Mobikwik)
- ✅ EMI Options

## 🚨 Important Notes

### For Production:

1. **Replace Test Keys**: Use live Razorpay keys
2. **Webhook Setup**: Configure webhooks for payment verification
3. **SSL Certificate**: Ensure HTTPS for production
4. **Order Verification**: Implement server-side verification

### Security:

- ✅ **Client-side only**: Test keys are safe to use in frontend
- ✅ **HTTPS Required**: Razorpay requires secure connections
- ✅ **Amount Validation**: Prevents tampering with payment amounts

## 🐛 Troubleshooting

### Common Issues:

1. **"Failed to load Razorpay script"**
   - Check internet connection
   - Verify script URL is accessible

2. **"Invalid key"**
   - Verify your Razorpay Key ID
   - Ensure it starts with `rzp_test_` for test mode

3. **Payment modal not opening**
   - Check browser console for errors
   - Ensure form validation passes

4. **Payment succeeds but order not updated**
   - Check Supabase connection
   - Verify order service is working

## 📞 Support

- **Razorpay Docs**: [https://razorpay.com/docs](https://razorpay.com/docs)
- **Test Cards**: [https://razorpay.com/docs/payment-gateway/test-cards](https://razorpay.com/docs/payment-gateway/test-cards)
- **Webhook Guide**: [https://razorpay.com/docs/webhooks](https://razorpay.com/docs/webhooks)

---

**Ready to test payments!** 🎉
