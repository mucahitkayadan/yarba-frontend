# Troubleshooting Guide

This document provides solutions to common issues with the Yarba frontend application.

## Current Issues

### 1. Infinite Login Attempts

**Problem:** When login fails, the application tries indefinitely, requiring you to close the page.

**Fix:** We've updated the code to prevent infinite retries:
1. Added request tracking in `firebaseAuthService.ts`
2. Added a 30-second cooldown period between retry attempts
3. Preventing duplicate token exchange requests

After this update, if login fails, an error message will be displayed instead of causing the browser to freeze.

### 2. No Console Logs in Development

**Problem:** Console logs aren't visible when running the application.

**Solutions:**
1. Use `npm run dev` - We've added a new script specifically for development that provides better logging
2. Check browser console (F12 or right-click → Inspect → Console)
3. Add `BROWSER=none` to `.env` file to prevent browser from opening automatically and see logs in terminal
4. Use verbose mode: `npm start -- --verbose`

### 3. Firebase Authentication Errors

#### Unauthorized Domain Error

**Problem:** Firebase returns "auth/unauthorized-domain" error.

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Authentication → Settings → Authorized domains
4. Add `localhost`, `www.yarba.app` and any other domains you're using

#### CORS Errors

**Problem:** Backend API requests fail with CORS policy errors.

**Solution:**
1. Ensure backend CORS configuration includes frontend domains
2. Verify protocol matches (http vs https)
3. Check for exact domain match including subdomains

## Enhanced Debugging

### Debug Mode

We've added a comprehensive debugging system to help troubleshoot issues:

1. **Enable Debug Mode:**
   - Use `npm run dev` or `npm run dev:win` (on Windows) to start the app with debugging enabled
   - This sets the `REACT_APP_DEBUG=true` environment variable

2. **View Debug Output:**
   - All debug logs will appear in your browser console
   - Logs are grouped by component for easier reading
   - API requests, Firebase operations, and authentication flows are all logged

3. **Debug Specific Components:**
   Look for logs from these specific debuggers:
   - `FirebaseAuth` - Login and registration components
   - `AuthContext` - Authentication state management
   - `API` - All API requests and responses
   - `Firebase` - Firebase configuration and operations
   - `AuthUtils` - Token management

4. **Troubleshoot Firebase Token Exchange:**
   - Look for `Token Exchange Process` log groups from the `FirebaseAuth` debugger
   - These show detailed information about token exchange attempts:
     - Request payloads
     - Response data
     - Error details
     - Retry timing

## Development Workflow

1. **Start the development server:**
   ```
   npm run dev
   ```
   Or on Windows:
   ```
   npm run dev:win
   ```

2. **Test authentication:**
   - Open browser console (F12)
   - Look for debug logs during login/registration
   - Check for Firebase error messages or token exchange issues

3. **Common errors and their solutions:**
   - **401 Unauthorized**: Backend doesn't recognize token - check token format
   - **403 Forbidden**: User doesn't have permission - check user roles
   - **422 Unprocessable Content**: Invalid data sent to backend - check request payload
   - **CORS errors**: Backend not configured to accept requests from your domain 