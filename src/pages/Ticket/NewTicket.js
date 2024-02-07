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
import urlConfig from "../../utils/urlConfig";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const config = urlConfig();

export default function NewTicket(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  // State variables to manage form data and fetch results
  const [traveler, setTravelerData] = useState({});
  const [selectedTrain, setSelectedTrain] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [trains, setTrains] = useState([]);
  const [nic, setNIC] = useState("");

  // Define the initial structure for a new ticket
  const entry = {
    id: "",
    travelerNIC: traveler.nic,
    trainId: selectedTrain,
    scheduleId: selectedSchedule,
    reservationDate: new Date(),
    referenceId: "",
  };

  // Function to handle changes in the form and update the entry object
  const newData = (e) => {
    const { name, value } = e.target;
    if (name === "reservationDate") {
      entry[name] = new Date(value);
    } else {
      entry[name] = value;
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    window.location = "/ticket-manage";
  }

  // Function to send a request to the server to create a new ticket
  const addNewTicket = () => {
    fetch(`${config.BaseURL}${config.methods.Ticket.get}`, {
      method: "POST",
      body: JSON.stringify(entry),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        if(response.status === 200){
            console.log("Response from adding a new ticket: ", response);
            setMessage("Ticket Added Successfully");
            setOpen(true);
            setSeverity("success");
        }else{
            setSeverity("error");
            setMessage("Error Adding Ticket");
            setOpen(true);
            }
        window.location = "/ticket-manage";
      })
      .catch((error) => {
        console.error("Error adding new ticket: ", error);
        setSeverity("error");
        setMessage("Error Adding Ticket");
        setOpen(true);
      });
  };

  useEffect(() => {
    // Parse the NIC from the URL on component mount
    const params = new URLSearchParams(window.location.search);
    const nicParam = params.get("nic");
    if (nicParam) {
      setNIC(nicParam);

      // Fetch list of trains from the API
      fetch(`${config.BaseURL}${config.methods.Train.get}`)
        .then((response) => response.json())
        .then((data) => setTrains(data))
        .catch((error) => {
            console.error("Error fetching train data: ", error);
            setSeverity("error");
            setMessage("Error Fetching Train Data");
            setOpen(true);
        });

      // Fetch traveler details from the API using the parsed NIC
      fetch(`${config.BaseURL}${config.methods.Traveler.get}/${nicParam}`)
        .then((response) => response.json())
        .then((data) => setTravelerData(data))
        .catch((error) =>
          {
            console.error("Error fetching traveler data: ", error);
            setSeverity("error");
            setMessage("Error Fetching Traveler Data");
            setOpen(true);
          }
        );
    }
  }, []);

  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <Header />
      <div className="parent">
        <div className="centered-div">
          <Container>
            <Typography variant="h4" gutterBottom>
              Add New Ticket
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Traveler NIC"
              value={nic}
              disabled
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Train Name</InputLabel>
              <Select
                value={selectedTrain}
                onChange={(e) => setSelectedTrain(e.target.value)}
              >
                {trains.map((train) => (
                  <MenuItem key={train.id} value={train.id}>
                    {train.trainName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedTrain && (
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Schedule</InputLabel>
                <Select
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                >
                  {trains
                    .find((train) => train.id === selectedTrain)
                    .schedule.map((schedule) => (
                      <MenuItem key={schedule.id} value={schedule.id}>
                        From: {schedule.origin} (
                        {new Date(schedule.originTime).toLocaleTimeString()})
                        to:
                        {schedule.destination} (
                        {new Date(
                          schedule.destinationTime
                        ).toLocaleTimeString()}
                        )
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Reservation Date"
              name="reservationDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={newData}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Reference ID"
              name="referenceId"
              onChange={newData}
            />
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button
                color="primary"
                onClick={() => (window.location = "/ticket-manage")}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={addNewTicket}
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
