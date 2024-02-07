import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import Header from "../../components/Header";
import urlConfig from "../../utils/urlConfig";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const config = urlConfig();

export default function CreateTravelerForm() {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  // State for storing new traveler's details
  const [entry, setEntry] = useState({
    id: "",
    nic: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isActive: true,
  });

  // Function to send the new traveler's details to the server
  const addNewTraveler = () => {
    console.log("Adding new traveler: ", entry);

    fetch(`${config.BaseURL}${config.methods.Traveler.register}`, {
      method: "POST",
      body: JSON.stringify(entry),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
            console.log("New traveler added successfully.");
            setMessage("New traveler added successfully.");
            setSeverity("success");
            setOpen(true);
          // If successfully added, redirect to traveler management page
          window.location = "/traveler-manage";
        } else {
          console.error("Error adding new traveler: ", response.statusText);
            setMessage("Error adding new traveler");
            setSeverity("error");
            setOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error adding new traveler: ", error);
        setMessage("Error adding new traveler");
        setSeverity("error");
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  // Handle changes in form fields and update the state accordingly
  const newData = (e) => {
    const { name, value } = e.target;
    let newValue = name === "isActive" ? value === "1" : value;

    setEntry((prevState) => ({ ...prevState, [name]: newValue }));
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Header />
      <div className="parent">
        <div className="centered-div">
          <Container component="section">
            <Typography variant="h4" gutterBottom>
              Add New Traveler
            </Typography>

            {/* Form fields for adding new traveler's details */}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="NIC"
              name="nic"
              onChange={newData}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="First Name"
              name="firstName"
              onChange={newData}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Last Name"
              name="lastName"
              onChange={newData}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              onChange={newData}
            />
            <TextField
              variant="outlined"
              margin="normal"
              type="password"
              fullWidth
              label="Password"
              name="password"
              onChange={newData}
            />

            {/* Action buttons to either cancel or add the new traveler */}
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button
                color="primary"
                onClick={() => (window.location = "/traveler-manage")}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={addNewTraveler}
              >
                Add
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
