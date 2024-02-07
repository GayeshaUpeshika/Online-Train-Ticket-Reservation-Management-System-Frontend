import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
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
import getUserRole from "../../utils/getUserRole";
import urlConfig from "../../utils/urlConfig";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const config = urlConfig();

export default function EditTraveler(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  // Getting the user role from a utility function
  const role = getUserRole();

  // Initializing states for traveler data, activity status, and NIC
  const [traveler, setTravelerData] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [nic, setNIC] = useState("");

  // Function to send updated traveler data to the server
  const updateTraveler = () => {
    fetch(`${config.BaseURL}${config.methods.Traveler.get}/${nic}`, {
      method: "PUT",
      body: JSON.stringify(traveler),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200) {
            setMessage("Error updating traveler data");
            setSeverity("error");
            setOpen(true);
        }else{
            setMessage("Traveler data updated successfully");
            setSeverity("success");
            setOpen(true);
        }
        window.location = "/traveler-manage";
      })
      .catch((e) => {
        console.error("Error updating traveler data: ", e);
        setMessage("Error updating traveler data");
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
    }

  // Function to handle data changes in form fields
  const newData = (e) => {
    const name_ = e.target.name;
    let v_ = e.target.value;

    if (name_ === "isActive") {
      setIsActive(v_);
    }

    setTravelerData((prevTraveler) => ({
      ...prevTraveler,
      [name_]: v_,
    }));
  };

  // Effect to fetch traveler data from server when component mounts
  useEffect(() => {
    let nic_ = window.location.search.split("=")[1];

    if (nic_) {
      setNIC(nic_);

      fetch(`${config.BaseURL}${config.methods.Traveler.get}/${nic_}`)
        .then((response) => response.json())
        .then((data) => {
          setIsActive(data.isActive);
          setTravelerData(data);
        })
        .catch((e) => {
            console.error("Error fetching traveler data by NIC: ", e);
            setMessage("Error fetching traveler data by NIC");
            setSeverity("error");
            setOpen(true);
        });
    }
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Header />
      <div className="parent">
        <div className="centered-div">
          <Container component="section">
            <Typography variant="h4" gutterBottom>
              Update Traveler
            </Typography>

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
              label="First Name"
              name="firstName"
              value={traveler.firstName}
              onChange={newData}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Last Name"
              name="lastName"
              value={traveler.lastName}
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
                label="Is Active"
                name="isActive"
                value={isActive}
                // Restrict changing the status if the user is not a Backoffice user
                disabled={role !== "Backoffice"}
                onChange={newData}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
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
