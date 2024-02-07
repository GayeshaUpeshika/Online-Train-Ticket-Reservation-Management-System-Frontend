import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { Button, Container, TextField, Typography, Box } from "@mui/material";
import urlConfig from "../../../utils/urlConfig";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const config = urlConfig();

export default function NewSchedule(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  // Initialize the entry state to store form input
  const [entry, setEntry] = useState({
    id: "",
    origin: "",
    originTime: "",
    destination: "",
    destinationTime: "",
  });

  // State for storing train ID from the URL
  const [rid, setRid] = useState("");

  // Make an API call to append a new schedule to the specified train
  const updateTicket = () => {
    fetch(
      `${config.BaseURL}${config.methods.Train.get}/${rid}/append-schedule`,
      {
        method: "POST",
        body: JSON.stringify(entry),
        headers: {
          "content-type": "application/json",
        },
      }
    )
      .then((response) => {
        if(response.status === 200){
            setMessage("Schedule Added Successfully");
            setSeverity("success");
            setOpen(true);
            console.log("Response for updating a ticket:", response);
        }else{
            setMessage("Error Adding Schedule");
            setSeverity("error");
            setOpen(true);
        }
        window.location = "/train-manage";
      })
      .catch((error) => {
        console.log("Error for updating a ticket:", error);
        setMessage("Error Adding Schedule");
        setSeverity("error");
        setOpen(true);
      });
  };

  // Capture form input and update the state accordingly
  const newData = (e) => {
    const { name, value } = e.target;
    setEntry((prevEntry) => ({ ...prevEntry, [name]: value }));
  };

  // Extract train ID from the URL
  useEffect(() => {
    const id_ = new URLSearchParams(window.location.search).get("id");
    if (id_) {
      setRid(id_);
    } else {
      window.location = "/train-manage"; // Redirect if ID isn't provided
    }
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Header />
      <div className="parent">
        <div className="centered-div">
          <Container>
            <Typography variant="h4" gutterBottom>
              New Schedule
            </Typography>

            {/* Schedule Form */}
            <TextField
              required
              variant="outlined"
              margin="normal"
              fullWidth
              label="Origin"
              name="origin"
              onChange={newData}
            />
            <TextField
              required
              variant="outlined"
              margin="normal"
              fullWidth
              label="Origin Time"
              name="originTime"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              onChange={newData}
            />
            <TextField
              required
              variant="outlined"
              margin="normal"
              fullWidth
              label="Destination"
              name="destination"
              onChange={newData}
            />
            <TextField
              required
              variant="outlined"
              margin="normal"
              fullWidth
              label="Destination Time"
              name="destinationTime"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              onChange={newData}
            />

            {/* Action Buttons */}
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button
                color="primary"
                onClick={() => (window.location = "/train-manage")}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={updateTicket}
              >
                Add New Schedule
              </Button>
            </Box>
          </Container>
        </div>
      </div>
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => setOpen(false)}
        >
            <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    </div>
  );
}
