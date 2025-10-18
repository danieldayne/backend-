# Hostinger Deployment Guide - Dentist Appointment System

## Overview
This guide will help you deploy your dentist appointment application to Hostinger, including both the frontend (React/Vite) and backend (Node.js/Express).

## Prerequisites
- Hostinger hosting account with Node.js support
- Domain name configured
- Supabase account for database
- PayPal developer account (optional)

## Deployment Steps

### 1. Backend Deployment (Node.js API)

#### Option A: Hostinger VPS/Cloud Hosting (Recommended)
1. **Upload Backend Files**
   - Compress your `backend/` folder
   - Upload via File Manager or FTP to your domain's root directory
   - Extract the files

2. **Install Dependencies**
   ```bash
   cd /path/to/your/domain
   npm install --production
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update environment variables:
   ```env
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   PAYPAL_MODE=live
   ```

4. **Start the Application**
   ```bash
   npm start
   ```

#### Option B: Hostinger Shared Hosting (Limited Node.js Support)
If using shared hosting with Node.js support:
1. Upload backend files to `public_html/api/` directory
2. Configure Node.js app in Hostinger control panel
3. Set startup file to `server.js`
4. Configure environment variables in hosting panel

### 2. Frontend Deployment

#### Upload Built Files
1. **Prepare Frontend Build**
   - Your frontend is already built in `frontend/dist/`
   - The build contains:
     - `index.html`
     - `assets/` folder with CSS and JS files

2. **Upload to Hostinger**
   - Upload contents of `frontend/dist/` to your domain's `public_html/` directory
   - Or create a subdomain for the frontend

3. **Configure API URLs**
   - Update your frontend API base URL to point to your backend
   - If backend is on same domain: `/api/`
   - If backend is on subdomain: `https://api.yourdomain.com/api/`

### 3. Domain Configuration

#### Single Domain Setup (Recommended)
```
yourdomain.com/          → Frontend (React app)
yourdomain.com/api/      → Backend API
```

#### Subdomain Setup
```
yourdomain.com/          → Frontend
api.yourdomain.com/      → Backend API
```

### 4. Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Note down your project URL and API keys

2. **Configure Database**
   - Import your database schema
   - Set up Row Level Security (RLS) policies
   - Configure authentication if needed

### 5. SSL Certificate
- Enable SSL in Hostinger control panel
- Update all URLs to use HTTPS
- Update CORS settings in backend to include HTTPS URLs

### 6. Environment Variables Update

Update your backend CORS configuration in `server.js`:
```javascript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'https://www.sandbox.paypal.com',
    'https://www.paypal.com',
    'https://checkout.paypal.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));
```

## File Structure After Deployment

```
public_html/
├── index.html              (Frontend)
├── assets/                 (Frontend assets)
├── api/                    (Backend - if using single domain)
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── routes/
│   ├── services/
│   └── ...
└── .htaccess              (URL rewriting rules)
```

## Testing Deployment

1. **Test Frontend**
   - Visit `https://yourdomain.com`
   - Check if the React app loads correctly

2. **Test Backend API**
   - Visit `https://yourdomain.com/api/health`
   - Should return: `{"status":"OK","message":"Dentist Appointment System API is running"}`

3. **Test Full Integration**
   - Try creating an account
   - Test appointment booking
   - Verify payment processing (if configured)

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Update CORS origins in `server.js`
   - Ensure HTTPS is used consistently

2. **API Not Found (404)**
   - Check `.htaccess` configuration
   - Verify file paths and permissions

3. **Environment Variables**
   - Ensure `.env` file is properly configured
   - Check Hostinger environment variable settings

4. **Database Connection**
   - Verify Supabase URL and keys
   - Check network connectivity from Hostinger

### Performance Optimization:
- Enable gzip compression
- Use CDN for static assets
- Optimize images and assets
- Monitor server resources

## Security Checklist
- [ ] SSL certificate enabled
- [ ] Environment variables secured
- [ ] Database RLS policies configured
- [ ] API rate limiting implemented
- [ ] CORS properly configured
- [ ] PayPal in live mode (not sandbox)

## Support
For Hostinger-specific issues, contact Hostinger support.
For application issues, check the logs and error messages.
