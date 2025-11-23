# 🔐 Power Admin Dashboard Access Guide

## How to Access the Hidden Power Admin Panel

### 1. Navigate to the Hidden URL
The Power Admin panel is accessible through a hidden route that is not publicly discoverable:

```
http://localhost:5173/#/poweradmin/login
```

**Note:** The `/poweradmin` route is completely separate from the regular user authentication system.

### 2. Demo Admin Credentials

#### Power Admin (Full Access)
- **Email:** `poweradmin@datafy.com`
- **Password:** `admin123`
- **Permissions:** Full system access including user management, billing, content, AI help desk, and system settings

#### Editor (Limited Access)
- **Email:** `editor@datafy.com`
- **Password:** `admin123`
- **Permissions:** Content creation, editing, and publishing only

### 3. Admin Panel Features

Once logged in, you'll have access to:

#### 🏠 Dashboard Overview
- System health monitoring
- Server performance metrics (CPU, Memory, Disk)
- Database status and connections
- API request analytics
- Revenue and user statistics
- System alerts and notifications

#### 👥 User Management (Power Admin Only)
- View all registered users
- Manage user roles and permissions
- Suspend/activate user accounts
- View user activity and analytics
- Export user data

#### 📝 Content Management
- WYSIWYG editor for blog posts and pages
- Content status management (Draft/Published/Archived)
- Category and tag management
- SEO optimization tools
- Content scheduling

#### 💳 Billing & Subscriptions (Power Admin Only)
- Stripe integration for payment processing
- Subscription management
- Revenue analytics
- Plan upgrades/downgrades
- Payment failure handling
- Billing history and exports

#### 🤖 AI Help Desk
- Intelligent backend diagnostics
- Automated issue resolution
- Quick fix suggestions
- System health analysis
- Error log monitoring

### 4. Security Features

- **Hidden URL:** Not discoverable through normal navigation
- **Role-based Access:** Different permission levels for different admin roles
- **IP Restriction:** Can be configured for specific IP addresses
- **2FA Support:** Two-factor authentication available
- **Session Management:** Secure admin session handling
- **Audit Logging:** All admin actions are logged

### 5. System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection for external integrations

### 6. Troubleshooting

#### Can't Access Admin Panel?
1. Ensure you're using the correct URL: `/#/poweradmin/login`
2. Check that you're using the correct credentials
3. Clear browser cache and cookies
4. Try incognito/private browsing mode

#### Permission Denied?
1. Verify your admin role has the required permissions
2. Contact the Power Admin to assign proper roles
3. Check if your account is active

#### Features Not Loading?
1. Check browser console for errors
2. Ensure your internet connection is stable
3. Verify that external services (Stripe, OpenAI) are configured

### 7. Best Practices

- **Always log out** when finished with admin tasks
- **Use strong passwords** and enable 2FA when available
- **Monitor system alerts** regularly
- **Keep audit logs** for compliance
- **Backup data** before making major changes

### 8. Emergency Access

If you lose access to the admin panel:
1. Check the browser's local storage for session data
2. Clear all browser data and try logging in again
3. Contact system administrator for password reset
4. Use emergency admin recovery procedures

---

## Quick Start Commands

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the admin panel:**
   - Navigate to: `http://localhost:5173/#/poweradmin/login`
   - Use credentials: `poweradmin@datafy.com` / `admin123`

3. **Test different admin roles:**
   - Power Admin: Full access to all features
   - Editor: Limited to content management only

The Power Admin panel is now fully functional with role-based access, WYSIWYG editing, AI help desk, and comprehensive system management tools.