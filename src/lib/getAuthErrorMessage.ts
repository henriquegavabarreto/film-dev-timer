// returns message based on Firebase Auth Error
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'This user has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'The email address is already in use.';
    case 'auth/weak-password':
      return 'The password is too weak. Please choose a stronger password.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};