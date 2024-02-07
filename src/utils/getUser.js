// Import the jwt-decode library to decode JWT tokens
import jwtDecode from "jwt-decode";

// Define a function `getUser` to fetch user details from a stored JWT token
const getUser = () => {
  // Retrieve the JWT token from local storage
  const token = localStorage.getItem("jwt");

  // If there's no token, return null
  if (!token) return null;

  // Decode the JWT token
  const decodedToken = jwtDecode(token);

  // Extract user details from the decoded JWT token
  const data = {
    name: decodedToken.unique_name, // Get the unique name from the token
    id: decodedToken.sub, // Get the name ID from the token
    email: decodedToken.email, // Get the email from the token
    // Get the user's role from the token. The key used here is typical for Microsoft's implementation of JWT.
    role: decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ],
  };

  // Return the extracted user details
  return data;
};

// Export the `getUser` function to be used in other parts of the application
export default getUser;
