# Admin Dashboard Fix - Setup Guide

## Issues Fixed

1. ✅ **Admin page loading issue** - Fixed by using backend API instead of direct Supabase queries
2. ✅ **Empty database boxes** - Fixed by bypassing RLS policies using service role key
3. ✅ **Error handling** - Added comprehensive error messages and loading states
4. ✅ **User information display** - Added users tab to view all registered users
5. ✅ **Responsive design** - Made all components responsive for mobile, tablet, and desktop
6. ✅ **Shipping address parsing** - Fixed JSON parsing for shipping addresses

## Backend Setup Required

### Step 1: Install Dependencies

Navigate to the `backend` folder and install the new dependency:

```bash
cd backend
npm install
```

This will install `@supabase/supabase-js` which is required for the admin endpoints.

### Step 2: Configure Environment Variables

Add these environment variables to your backend `.env` file (or create one if it doesn't exist):

```env
# Existing Razorpay config
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# New Supabase config for admin endpoints
SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Server config
PORT=3001
NODE_ENV=development
```

### Step 3: Get Supabase Service Role Key

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (NOT the anon key)
4. Add it to your backend `.env` file as `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important**: The service role key bypasses Row Level Security (RLS) policies. Keep it secure and never expose it in frontend code!

### Step 4: Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

The server should start on `http://localhost:3001` (or your configured PORT).

### Step 5: Configure Frontend API URL (Optional)

If your backend is running on a different URL, update the frontend environment variable:

Create or update `.env` in the root directory:

```env
VITE_API_URL=http://localhost:3001
```

For production, set this to your production backend URL.

## How It Works

### Before (Direct Supabase Queries)
- Admin dashboard tried to query Supabase directly
- RLS policies blocked anonymous users from viewing all orders
- Result: Empty data, infinite loading

### After (Backend API)
- Admin dashboard calls backend API endpoints
- Backend uses service role key to bypass RLS
- Backend fetches all orders and users
- Result: All data displayed correctly

## New Features

### 1. Orders Tab
- View all orders with full details
- Search and filter functionality
- Expandable order details showing:
  - Customer information
  - Shipping address
  - Order items
  - Payment information

### 2. Users Tab
- View all registered users
- See user order counts
- User contact information

### 3. Statistics Cards
- Total Orders
- Total Revenue
- Paid Orders
- Pending Orders
- Total Users

### 4. Error Handling
- Clear error messages if backend is not available
- Loading states during data fetch
- Refresh button to reload data

## API Endpoints

### GET `/api/admin/orders`
Fetches all orders with order items.

**Headers:**
- `x-admin-email`: Admin email (ceo@trueskin.app)
- `x-admin-token`: admin_authenticated

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "customerName": "...",
      "customerEmail": "...",
      "totalAmount": 1000,
      "status": "paid",
      "items": [...]
    }
  ]
}
```

### GET `/api/admin/users`
Fetches all users with order counts.

**Headers:**
- `x-admin-email`: Admin email (ceo@trueskin.app)
- `x-admin-token`: admin_authenticated

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "email": "...",
      "fullName": "...",
      "orderCount": 5
    }
  ]
}
```

## Troubleshooting

### Issue: "Failed to load orders"
**Solution:**
1. Check if backend server is running
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in backend `.env`
3. Check backend console for error messages
4. Verify the API URL in frontend matches your backend URL

### Issue: "Unauthorized" error
**Solution:**
1. Make sure you're logged in as admin
2. Check that `admin_authenticated` is set in localStorage
3. Verify admin email is `ceo@trueskin.app`

### Issue: Backend can't connect to Supabase
**Solution:**
1. Verify `SUPABASE_URL` is correct
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (service_role key, not anon key)
3. Check your internet connection
4. Verify Supabase project is active

### Issue: Empty data even after setup
**Solution:**
1. Check browser console for errors
2. Check backend console for errors
3. Verify RLS policies allow service role to read data
4. Test Supabase connection directly

## Security Notes

- The service role key bypasses all RLS policies
- Only use it on the backend, never in frontend code
- The admin authentication is simple (localStorage-based)
- For production, consider implementing proper JWT-based admin authentication
- Consider adding rate limiting to admin endpoints

## Next Steps (Optional Enhancements)

1. Add order status update functionality
2. Add export to CSV/Excel
3. Add analytics and charts
4. Implement proper admin authentication with JWT
5. Add order notes/comments
6. Add order tracking numbers
7. Add product management section

