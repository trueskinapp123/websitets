# Supabase Integration Setup

This document explains how to set up Supabase integration for the TrueSkin website.

## Prerequisites

1. A Supabase account and project
2. Your Supabase URL and anon key (already provided)

## Database Setup

### 1. Run the SQL Script

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the script to create all necessary tables and data

### 2. Tables Created

The script creates the following tables:

- **products**: Stores product information
- **cart_items**: Stores user cart items
- **orders**: Stores order information
- **order_items**: Stores individual items within orders

### 3. Sample Data

The script also inserts the three sample products (Heal Pack, Fresh Pack, Glow Pack) that are currently hardcoded in the application.

## Features Implemented

### 1. Product Management
- Products are now stored in Supabase
- Fallback to hardcoded data if Supabase is unavailable
- Easy to add, update, or remove products through the database

### 2. Cart Persistence
- Cart items are saved to Supabase for logged-in users
- Cart persists across browser sessions
- Real-time synchronization with the database

### 3. Order Management
- Complete order creation and tracking system
- Order status management
- Order history for users

### 4. User Authentication Ready
- Database is set up with Row Level Security (RLS)
- User-specific data isolation
- Ready for authentication integration

## Configuration

The Supabase configuration is already set up in:
- `src/lib/supabase.ts` - Supabase client configuration
- `src/types/database.ts` - TypeScript types for database
- `src/services/` - Service layer for database operations

## Usage

### For Development
The application will work with or without Supabase. If Supabase is not available, it falls back to the hardcoded product data.

### For Production
1. Ensure your Supabase project is properly configured
2. Run the SQL setup script
3. The application will automatically use Supabase for data persistence

## Next Steps

1. **Authentication**: Add user authentication using Supabase Auth
2. **Admin Panel**: Create an admin interface to manage products
3. **Order Processing**: Implement order status updates and notifications
4. **Analytics**: Add order and product analytics
5. **Payment Integration**: Integrate with payment providers

## Troubleshooting

### Common Issues

1. **RLS Policies**: Make sure Row Level Security policies are properly set up
2. **CORS**: Ensure your domain is added to Supabase CORS settings
3. **API Keys**: Verify your anon key is correct and has proper permissions

### Debug Mode

To debug Supabase operations, check the browser console for error messages. The application includes comprehensive error handling and logging.

## Security Notes

- The anon key is safe to use in client-side code
- RLS policies ensure users can only access their own data
- Sensitive operations should be handled through Supabase Edge Functions
- Consider implementing rate limiting for production use
