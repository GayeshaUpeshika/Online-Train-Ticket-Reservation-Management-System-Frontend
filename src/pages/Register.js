import React, { useState } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import urlConfig from "../utils/urlConfig";
import Header from "../components/Header";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const config = urlConfig();
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Registration = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  // State to hold form data
  const [userDetails, setUserDetails] = useState({
    id: "",
    email: "",
    name: "",
    password: "",
    role: "TravelAgent", // Default role selection
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setMessage("");
  }

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${config.BaseURL}${config.methods.User.register}`,
        userDetails
      );
        if(response.status === 200){
          setOpen(true);
          setMessage("Registration successful");
          setSeverity("success");
          console.log("Registered successfully:", response.data);
          window.location.href = "/login";
        }else{
          console.error("Registration error:", response.data);
          setSeverity("error");
          setMessage("Registration error");
          setOpen(true);
        }
    } catch (error) {
      setSeverity("error");
      setMessage("Registration error");
      setOpen(true);
      console.error("Registration error:", error.response.data);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Header />
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <form onSubmit={handleFormSubmit}>
        {/* Name Input */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={userDetails.name}
          onChange={handleInputChange}
        />

        {/* Email Input */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
        />

        {/* Role Selection */}
        <FormControl component="fieldset">
          <FormLabel component="legend">Role</FormLabel>
          <RadioGroup
            aria-label="role"
            name="role"
            value={userDetails.role}
            onChange={handleInputChange}
          >
            <FormControlLabel
              value="Backoffice"
              control={<Radio />}
              label="Back Office"
            />
            <FormControlLabel
              value="TravelAgent"
              control={<Radio />}
              label="Travel Agent"
            />
          </RadioGroup>
        </FormControl>

        {/* Password Input */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={userDetails.password}
          onChange={handleInputChange}
        />

        {/* Submit Button */}
        <Button type="submit" fullWidth variant="contained" color="primary">
          Register
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Registration;
