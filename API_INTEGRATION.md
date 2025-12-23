# Nepix Frontend - API Integration

## 🔗 API Connection

The frontend is now connected to the Nepix API hosted at `https://nepix-api.onrender.com`

### Authentication Endpoints

- **Register**: `POST /api/register`
  - Required fields: `username`, `email`, `password`
  
- **Login**: `POST /api/login`
  - Required fields: `username`, `password`

## 📝 How It Works

### Registration Flow

1. User fills out the registration form with username, email, and password
2. Form validation ensures all fields are filled and email format is correct
3. Password must be at least 8 characters
4. Data is sent to `/api/register` endpoint
5. On success, user receives a token and is redirected to dashboard
6. Token and user data are stored in localStorage

### Login Flow

1. User enters username/email and password
2. Data is sent to `/api/login` endpoint (using username field)
3. On success, user receives a token and is redirected to dashboard
4. Token and user data are stored in localStorage

## 🔐 Authentication Storage

User authentication data is stored in the browser's localStorage:
- `authToken`: JWT token for authenticated requests
- `userData`: User information returned from the API

## 📁 Files Modified

- **auth.js**: Main authentication handler
  - `handleRegister()`: Handles registration form submission
  - `handleLogin()`: Handles login form submission
  - `showMessage()`: Displays user-friendly error/success messages
  - `checkAuth()`: Checks if user is already logged in
  - `logout()`: Clears authentication and redirects to index

- **login.html**: Added `name` attributes to form inputs and included `auth.js` script
- **register.html**: Added `name` attributes to form inputs and included `auth.js` script

## 🚀 Deployment

The frontend is deployed at: `https://nepix.lat`
The API is deployed at: `https://nepix-api.onrender.com`

## 🔧 Testing Locally

1. Open the frontend files in a local server (e.g., using Live Server extension in VS Code)
2. Navigate to `login.html` or `register.html`
3. Try creating an account or logging in
4. Check browser console for detailed logs
5. Successful authentication will redirect to `dashboard.html`

## ⚠️ Important Notes

- The API expects `username` field for login, not email
- All passwords must be at least 8 characters
- Email format validation is performed client-side
- CORS is configured on the API to allow requests from nepix.lat
- Error messages are displayed to users for better UX

## 🐛 Debugging

If you encounter issues:
1. Check browser console for error messages
2. Verify API is running at https://nepix-api.onrender.com/api/health
3. Check network tab in DevTools to see request/response
4. Ensure form inputs have the correct `name` attributes
5. Verify localStorage is enabled in your browser
