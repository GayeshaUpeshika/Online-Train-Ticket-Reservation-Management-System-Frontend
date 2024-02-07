// Importing React and necessary hooks for component creation and navigation
import React from "react";
import { useNavigate } from "react-router-dom";

// Importing utility function to determine the user's role
import getUserRole from "../utils/getUserRole";

// Importing necessary components from Material-UI for building the AppBar UI
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import navImage from "../resources/navnew3.jpg";
// Creating a Header component
const Header = () => {
  // Fetching the user's role (e.g. "TravelAgent", "Backoffice", or none)
  const role = getUserRole();

  // Initializing the navigation hook from React Router
  const navigate = useNavigate();

  // Handler function for the logout process
  const handleLogout = () => {
    // Removing the JWT token from local storage
    localStorage.removeItem("jwt");

    // Optionally, call the API to invalidate the token on the server side (not implemented here)

    // Redirecting the user to the login page
    navigate("/login");
  };

  return (
    <div>
      <div className="navImageContainer">
        <a href="#">
          <img src={navImage} alt="Navigation" style={{ width: "100%" }} />
        </a>
      </div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            {/* Conditionally rendering navigation buttons based on the user's role */}

            {/* For TravelAgent */}
            {role === "TravelAgent" && (
              <>
                <Button variant="text" color="inherit" href="/dashboard">
                  Dashboard
                </Button>
                <Button variant="text" color="inherit" href="/traveler-manage">
                  Traveler
                </Button>
                <Button variant="text" color="inherit" href="/ticket-manage">
                  Ticket
                </Button>
                <Button variant="text" color="inherit" href="/train-manage">
                  Train
                </Button>
              </>
            )}

            {/* For Backoffice */}
            {role === "Backoffice" && (
              <>
                <Button variant="text" color="inherit" href="/dashboard">
                  Dashboard
                </Button>
                <Button variant="text" color="inherit" href="/traveler-manage">
                  Traveler
                </Button>
                <Button variant="text" color="inherit" href="/ticket-manage">
                  Ticket
                </Button>
                <Button variant="text" color="inherit" href="/train-manage">
                  Train
                </Button>
              </>
            )}

            {/* For users who are not logged in */}
            {!role && (
              <>
                <Button variant="text" color="inherit" href="/login">
                  Login
                </Button>
                <Button variant="text" color="inherit" href="/register">
                  Register
                </Button>
              </>
            )}

            {/* Logout button which only displays for logged-in users */}
            {role && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

// Exporting the Header component to be used in other parts of the app
export default Header;
