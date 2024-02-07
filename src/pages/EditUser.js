import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import getUser from "../utils/getUser";
import urlConfig from "../utils/urlConfig";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const config = urlConfig();

export default function EditUser(props) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  // Getting the user role from a utility function
  const user = getUser();

  // Initializing states for traveler data, activity status, and NIC
  const [traveler, setTravelerData] = useState({
    id:"",
    name: "",
    email: "",
    password: "",
    role: "TravelAgent",
  });

  // Function to send updated traveler data to the server
  const updateTraveler = () => {
    fetch(`${config.BaseURL}${config.methods.User.get}/${user.id}`, {
      method: "PUT",
      body: JSON.stringify(traveler),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          setMessage("Error updating user data");
          setSeverity("error");
          setOpen(true);
        } else {
          console.log(response);
          setMessage("User data updated successfully");
          setSeverity("success");
          setOpen(true);
        }
        // Removing the JWT token from local storage
        localStorage.removeItem("jwt");

        // Optionally, call the API to invalidate the token on the server side (not implemented here)

        // Redirecting the user to the login page
        window.location = "/dashboard";

      })
      .catch((e) => {
        console.error("Error updating user data: ", e);
        setMessage("Error updating user data");
        setSeverity("error");
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setMessage("");
  };

  // Function to handle data changes in form fields
  const newData = (e) => {
    const name_ = e.target.name;
    let v_ = e.target.value;

    setTravelerData((prevTraveler) => ({
      ...prevTraveler,
      [name_]: v_,
    }));
  };

  // Effect to fetch traveler data from server when component mounts
  useEffect(() => {
    setTravelerData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Header />
      <div className="parent">
        <div className="centered-div">
          <Container component="section">
            <Typography variant="h4" gutterBottom>
              Update User
            </Typography>

            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Name"
              name="name"
              value={traveler.name}
              onChange={newData}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              value={traveler.email}
              onChange={newData}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              type="password"
              onChange={newData}
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="isActive-label">Is Active</InputLabel>
              <Select
                labelId="isActive-label"
                label="Role"
                name="role"
                value={traveler.role}
                onChange={newData}
              >
                <MenuItem value={"TravelAgent"}>TravelAgent</MenuItem>
                <MenuItem value={"Backoffice"}>Backoffice</MenuItem>
              </Select>
            </FormControl>
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button
                color="primary"
                onClick={() => (window.location = "/dashboard")}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={updateTraveler}
              >
                Update
              </Button>
            </Box>
          </Container>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
