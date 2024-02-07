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

export default function EditTicket() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  // States for handling user input, fetched trains and the ticket ID.
  const [selectedTrain, setSelectedTrain] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [refId, setRefid] = useState("");
  const [trains, setTrains] = useState([]);
  const [entry, setEntry] = useState({
    id: "",
    travelerNIC: "",
    trainId: selectedTrain,
    scheduleId: selectedSchedule,
    reservationDate: "",
    referenceId: refId,
  });
  const [rid, setRid] = useState("");

  // Function to handle updating the ticket.
  const updateTicket = () => {
    const updatedData = {
      ...entry,
      trainId: selectedTrain,
      scheduleId: selectedSchedule,
      referenceId: refId,
    };

    fetch(`${config.BaseURL}${config.methods.Ticket.get}/${rid}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        if(response.status === 200){
          console.log("Response from updating ticket: ", response);
          setMessage("Ticket updated successfully!");
          setSeverity("success");
          setOpen(true);
        }else{
          console.log("Response from updating ticket: ", response);
          setMessage("Error updating ticket!");
          setSeverity("error");
          setOpen(true);
        }
        window.location = "/ticket-manage";
      })
      .catch((error) => {
        console.error("Error updating ticket: ", error);
        setMessage("Error updating ticket!");
        setSeverity("error");
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    window.location = "/ticket-manage";
  };

  // Function to handle input changes and update the state.
  const newData = (e) => {
    const { name, value } = e.target;
    setEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  // Fetch necessary data once the component is mounted.
  useEffect(() => {
    // Get ticket ID from the URL.
    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get("id");
    if (ticketId) {
      setRid(ticketId);

      // Fetch train data.
      fetch(`${config.BaseURL}${config.methods.Train.get}`)
        .then((response) => response.json())
        .then((data) => setTrains(data))
        .catch((error) => {
          console.error("Error fetching train data: ", error);
          setMessage("Error fetching train data!");
          setSeverity("error");
          setOpen(true);
        });

      // Fetch the existing ticket details.
      fetch(`${config.BaseURL}${config.methods.Ticket.get}/${ticketId}`)
        .then((response) => response.json())
        .then((data) => {
          setEntry(data);
          setRefid(data.referenceID);
          setSelectedTrain(data.trainId);
          setSelectedSchedule(data.scheduleId);
        })
        .catch((error) =>
          {
            console.error("Error fetching ticket data: ", error);
            setMessage("Error fetching ticket data!");
            setSeverity("error");
            setOpen(true);
          }
        );
    }
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Header />
      <div className="parent">
        <div className="centered-div">
          <Container>
            <Typography variant="h4" gutterBottom>
              Update Ticket
            </Typography>

            {/* Display traveler's NIC (Non-editable). */}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Traveler NIC"
              name="travelerNIC"
              value={entry.travelerNIC}
              disabled
            />

            {/* Dropdown to select train. */}
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Train Name</InputLabel>
              <Select
                value={selectedTrain}
                onChange={(e) => setSelectedTrain(e.target.value)}
                label="Train Name"
              >
                {trains.map((train) => (
                  <MenuItem key={train.id} value={train.id}>
                    {train.trainName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Dropdown to select schedule based on the selected train. */}
            {selectedTrain && (
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Schedule</InputLabel>
                <Select
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                  label="Schedule"
                >
                  {trains
                    .find((train) => train.id === selectedTrain)
                    .schedule.map((schedule) => (
                      <MenuItem key={schedule.id} value={schedule.id}>
                        {`From: ${schedule.origin} (${new Date(
                          schedule.originTime
                        ).toLocaleTimeString()}) To: ${
                          schedule.destination
                        } (${new Date(
                          schedule.destinationTime
                        ).toLocaleTimeString()})`}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}

            {/* Input for reservation date. */}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Reservation Date"
              name="reservationDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={entry.reservationDate.split("T")[0]}
              onChange={newData}
            />

            {/* Input for reference ID. */}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Reference ID"
              name="referenceId"
              value={refId}
              onChange={(e) => setRefid(e.target.value)}
            />

            {/* Action buttons: Cancel and Update */}
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
                onClick={updateTicket}
              >
                Update
              </Button>
            </Box>
          </Container>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
