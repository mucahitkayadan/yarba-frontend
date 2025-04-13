/**
 * Utility for handling Firebase error messages
 */

/**
 * Extract a user-friendly error message from Firebase errors
 */
export const getFirebaseErrorMessage = (error: any): string => {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Extract standard error message
  let errorMessage = error.message || 'An error occurred';
  
  // Extract Firebase error code
  const errorCode = error.code || '';

  // If the error is from Firebase, it typically includes 'Firebase:'
  // Extract the more readable part
  if (errorMessage.includes('Firebase:')) {
    errorMessage = errorMessage.split('Firebase:')[1].trim();
  }

  // Create more user-friendly messages for common Firebase errors
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please use a different email or try logging in.';
    case 'auth/invalid-email':
      return 'The email address is invalid. Please check and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check or register.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/invalid-credential':
      return 'Invalid login credentials. Please check your email and password and try again.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use a stronger password.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was canceled because the popup was closed.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please enable popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'The popup request was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error occurred. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later or reset your password.';
    case 'auth/requires-recent-login':
      return 'This operation requires re-authentication. Please log in again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Firebase authentication. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'This login method is not enabled. Please contact support.';
    case 'auth/invalid-tenant-id':
      return 'Authentication configuration error. Please contact support or try again later.';
    default:
      // If we don't have a specific handler, return the error message
      return errorMessage;
  }
}; 