# QR Builder - Authentication Setup Guide

This guide will help you set up authentication and user data protection for your QR Builder application using Supabase Auth and Row Level Security (RLS).

## 🚀 Quick Setup

### 1. Enable Authentication in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Enable **Email** authentication
5. Configure any additional providers you want (optional)

### 2. Run Database Schema Updates

Execute the SQL commands in `supabase-schema.sql` in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run**

This will:
- Enable Row Level Security (RLS) on all tables
- Add user_id foreign keys to QR codes table
- Create RLS policies for data protection
- Insert default QR templates
- Create helper functions for analytics

### 3. Environment Variables

Your `.env.local` should already have these variables configured:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test the Setup

1. Start your development server: `npm run dev`
2. Visit your app - you should see the authentication screen
3. Create a new account or sign in
4. Generate QR codes - they should be saved to your user account
5. Sign out and sign back in - your QR history should persist

## 🔒 Security Features Implemented

### Row Level Security (RLS) Policies

**QR Codes Table:**
- Users can only view their own QR codes
- Anonymous users can still view public QR codes (user_id = null)
- Authenticated users can create QR codes linked to their account
- Users can only update/delete their own QR codes

**Templates Table:**
- Public read access for all users
- Only service role can modify templates

**Analytics Table:**
- Users can only view analytics for their own QR codes
- Anyone can insert scan analytics (for tracking)
- Users can update/delete analytics for their own QR codes

### Authentication Flow

1. **Unauthenticated users:** Can still use the app but QR codes won't be saved
2. **Sign up:** Creates a new user account with email verification (optional)
3. **Sign in:** Authenticates existing users
4. **Session management:** Automatic session persistence and refresh
5. **Sign out:** Cleans up session and returns to auth screen

## 🎯 Features

### With Authentication Enabled:
- ✅ User accounts with email/password
- ✅ Secure QR code storage per user
- ✅ Personal QR code history
- ✅ Data isolation between users
- ✅ Session persistence across browser refreshes
- ✅ Batch QR generation with user association
- ✅ Analytics data protection

### Without Authentication:
- ✅ Full QR code generation functionality
- ✅ All customization options
- ✅ Export features (PDF, SVG)
- ❌ QR codes not saved to database
- ❌ No history persistence

## 📊 Database Schema

### Updated Tables

```sql
-- QR codes table with user association
qr_codes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  data JSONB NOT NULL,
  style JSONB NOT NULL,
  image_url TEXT,
  scan_count INTEGER DEFAULT 0,
  last_scanned TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Public templates (unchanged)
qr_templates (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  default_data JSONB NOT NULL,
  default_style JSONB NOT NULL,
  category TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics with privacy protection
qr_analytics (
  id UUID PRIMARY KEY,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
  scan_date TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT
);
```

## 🛠️ Customization Options

### Authentication Providers

To add additional auth providers (Google, GitHub, etc.):

1. Enable the provider in Supabase Dashboard → Authentication → Providers
2. Configure OAuth credentials
3. Update the Auth component to include provider buttons:

```tsx
// In src/components/Auth.tsx
const signInWithProvider = async (provider: 'google' | 'github') => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider
  })
  if (error) setError(error.message)
}
```

### Email Templates

Customize authentication emails in Supabase Dashboard → Authentication → Email Templates:
- Confirmation email
- Password reset email
- Magic link email

### User Profiles

Extend user data by modifying the signup form:

```tsx
const { error } = await signUp(
  email,
  password,
  { 
    full_name: fullName,
    avatar_url: avatarUrl,
    // Add more custom fields
  }
)
```

## 🔧 Troubleshooting

### Common Issues

**1. "Authentication not configured" errors:**
- Check that your Supabase environment variables are set correctly
- Verify the Supabase URL starts with `https://`
- Ensure the anon key is correct

**2. RLS policies blocking operations:**
- Verify the SQL schema was applied correctly
- Check that user authentication state is properly managed
- Test with the Supabase Dashboard SQL editor

**3. Users can't access their data after signin:**
- Ensure `user.id` is being passed correctly to database operations
- Check that the auth context is properly providing user state
- Verify RLS policies allow access for authenticated users

**4. Session not persisting:**
- Check that the AuthProvider wraps your entire app
- Verify the auth state is being properly initialized
- Clear browser cache and try again

### Debug Commands

Check authentication status:
```javascript
// In browser console
console.log(await supabase.auth.getUser())
console.log(await supabase.auth.getSession())
```

Test RLS policies:
```sql
-- In Supabase SQL Editor
SELECT auth.uid(); -- Should return current user ID
SELECT * FROM qr_codes; -- Should only show user's QR codes
```

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify Supabase project status in the dashboard
3. Test database queries directly in Supabase SQL Editor
4. Review the RLS policies are correctly applied

## 🎉 Next Steps

With authentication enabled, you can now:
- Add user profile management
- Implement QR code sharing features
- Add team/organization support
- Enhance analytics with user insights
- Build premium features with subscription management

Your QR Builder now has enterprise-grade security and user management! 🚀
