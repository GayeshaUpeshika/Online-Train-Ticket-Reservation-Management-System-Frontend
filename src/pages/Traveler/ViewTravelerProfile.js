/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Avatar,
  Grid,
} from "@mui/material";
import urlConfig from "../../utils/urlConfig";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const config = urlConfig();

export default function ViewTravelerProfile() {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  // State variables to store traveler data, activity status, NIC and modal status
  const [traveler, setTravelerData] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [nic, setNIC] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to toggle the modal's visibility
  const handleModal = (hide) => {
    setShowDeleteModal(!hide);
  };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
        setMessage("");
    };

  // Effect to fetch traveler data when component mounts
  useEffect(() => {
    let nic_ = window.location.search;
    if (nic_) {
      nic_ = nic_.split("=")[1];
    }

    if (nic_) {
      setNIC(nic_);

      // Fetch traveler data by NIC
      fetch(`${config.BaseURL}${config.methods.Traveler.get}/${nic_}`)
        .then((response) => response.json())
        .then((data) => {
          setIsActive(data.isActive);
          setTravelerData(data);
        })
        .catch((e) => {
            console.error("Error fetching traveler data by NIC: ", e);
            setOpen(true);
            setMessage("Error fetching traveler data by NIC");
            setSeverity("error");
        });
    }
  }, []);

  // Function to delete a traveler based on NIC
  const deleteTraveler = () => {
    fetch(`${config.BaseURL}${config.methods.Traveler.get}/${nic}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
            console.log("Traveler deleted successfully.");
            setOpen(true);
            setMessage("Traveler deleted successfully.");
            setSeverity("success");
          handleModal(true);
          window.location.reload();
        } else {
          console.error("Failed to delete traveler.");
            setOpen(true);
            setMessage("Failed to delete traveler.");
            setSeverity("error");
        }
      })
      .catch((error) =>
        {console.error("Error during traveler deletion: ", error)
        setMessage("Error during traveler deletion.");
        setSeverity("error");
        setOpen(true);}
      );
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Header />
      <div className="parent">
        <div className="centered-div">
          <Container>
            <Typography variant="h4" gutterBottom>
              Traveler Profile
            </Typography>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                {/* Display traveler's avatar */}
                <Avatar
                  alt="Profile"
                  src="https://cdn-icons-png.flaticon.com/512/6784/6784004.png"
                  sx={{ width: 150, height: 150 }}
                />
              </Grid>
            </Grid>
            {/* Display traveler's details */}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="NIC"
              name="nic"
              value={nic}
              disabled
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="firstName"
              value={traveler.firstName}
              disabled
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="lastName"
              value={traveler.lastName}
              disabled
            />
            {/* Edit and Delete traveler buttons */}
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                href={`/edit-traveler?nic=${traveler.nic}`}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginLeft: "10px" }}
                onClick={() => deleteTraveler(traveler.nic)}
              >
                Delete
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
