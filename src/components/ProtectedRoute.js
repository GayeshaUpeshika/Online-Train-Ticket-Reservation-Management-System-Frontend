/**
 * ProtectedRoute Component
 *
 * This component serves as a wrapper around routes that require authentication.
 * If a user tries to access a route wrapped within this component without having
 * a JWT token in local storage, they'll be redirected to the login page.
 * If the token exists, it renders the child components.
 */

const ProtectedRoute = ({ children }) => {
  // Fetch the JWT token from local storage
  const token = localStorage.getItem("jwt");

  // If the token doesn't exist, redirect the user to the login page
  if (!token) {
    window.location.href = "/login";
    return null; // Return null so that React doesn't render anything for this component
  }

  // If the token exists, render the child components passed to this component
  return children;
};

// Export the ProtectedRoute component for use in other parts of the app
export default ProtectedRoute;
