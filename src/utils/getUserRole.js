// Import the jwt-decode library to decode JWT tokens
import jwtDecode from "jwt-decode";

// Define a function `getUserRole` to fetch the user's role from a stored JWT token
const getUserRole = () => {
  // Retrieve the JWT token from local storage
  const token = localStorage.getItem("jwt");

  // If there's no token, return null
  if (!token) return null;

  // Decode the JWT token
  const decodedToken = jwtDecode(token);

  // Return the user's role from the decoded JWT token. The key used here is typical for Microsoft's implementation of JWT.
  return decodedToken[
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  ];
};

// Export the `getUserRole` function to be used in other parts of the application
export default getUserRole;
