// errorManager.js

// Custom Error Types
export class ConnectionError extends Error {
  constructor(details) {
    super(details);
    this.name = 'ConnectionError';
  }
}

export class ServiceError extends Error {
  constructor(details) {
    super(details);
    this.name = 'ServiceError';
  }
}

// Error processing function
export function processError(err) {
  console.error('Error encountered:', err);

  // Example: Show user notification or alert
  // displayMessage('Something went wrong. Please try again.');

  // Example: Navigate to error page or fallback
  // navigateToErrorPage();

  // Specific handling based on error type
  if (err instanceof ConnectionError) {
    // Handle connection-related issues
    console.error('Connection issue:', err.message);
    // Example: Show user-friendly message
    alert('Connection issue. Please check your internet connection.');
  } else if (err instanceof ServiceError) {
    // Handle errors from external services (API errors)
    console.error('Service issue:', err.message);
    // Example: Display user-friendly message
    alert('Service issue. Please try again later.');
  } else {
    // Catch-all for any other errors
    console.error('Unexpected issue:', err.message);
    // Example: Show a generic error message
    alert('Something went wrong. Please try again later.');
  }
}
