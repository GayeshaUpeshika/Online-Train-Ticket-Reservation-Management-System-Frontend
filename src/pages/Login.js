import React, { useState } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import axios from "axios";
import Header from "../components/Header";
import urlConfig from "../utils/urlConfig";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const config = urlConfig();
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Login = ({ setToken }) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  // State to hold form data for login
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setMessage('');
  }

  // Handle changes in the form input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending the form data to the server for authentication
      const response = await axios.post(
        `${config.BaseURL}${config.methods.User.login}`,
        loginDetails
      );
        if(response.status === 200){
          setOpen(true);
          setMessage('Logged in successfully');
          setSeverity('success');
          // Store the authentication token in local storage
          const token = response.data.token;
          localStorage.setItem("jwt", token);

          // Set the token to the parent state (if using context or parent prop method)
          setToken(token);

          console.log("Logged in successfully:", response.data);

          // Redirect to dashboard after successful login
          window.location.href = "/dashboard";
        }else{
          setOpen(true);
          setMessage('Invalid Credentials');
          setSeverity('error');
        }
    } catch (error) {
      setOpen(true);
      setMessage('Invalid Credentials');
      setSeverity('error');
      console.error("Login error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Header />
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <form onSubmit={handleLoginSubmit}>
        {/* Email Input Field */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={loginDetails.email}
          onChange={handleInputChange}
        />

        {/* Password Input Field */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={loginDetails.password}
          onChange={handleInputChange}
        />

        {/* Login Button */}
        <Button type="submit" fullWidth variant="contained" color="primary">
          Login
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
