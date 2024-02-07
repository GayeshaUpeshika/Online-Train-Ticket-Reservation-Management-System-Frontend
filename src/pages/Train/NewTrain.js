import React, { useEffect, useState } from "react";
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
import Header from "../../components/Header";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const config = urlConfig();

export default function NewTrain(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  const [schedules, setSchedules] = useState([
    {
      id: "",
      origin: "",
      originTime: "",
      destination: "",
      destinationTime: "",
    },
  ]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
        return; 
    }
    setOpen(false);
    setMessage("");
    };

  const [entry, setEntry] = useState({
    id: "",
    trainName: "",
    status: 0,
    schedule: schedules,
  });

  const scrollableStyle = {
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid #cccccc",
    padding: "10px",
    marginBottom: "15px",
  };

  const handleScheduleChange = (index, name, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][name] = value;
    setSchedules(newSchedules);
  };

  const addNewSchedule = () => {
    setSchedules([
      ...schedules,
      {
        id: "",
        origin: "",
        originTime: "",
        destination: "",
        destinationTime: "",
      },
    ]);
  };

  const handleRemoveSchedule = (index) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    setSchedules(newSchedules);
  };

  const addNewTicket = () => {
    const ticketData = {
      ...entry,
      schedule: schedules,
    };
    console.log("The New Ticket Is: ", entry);

    fetch(`${config.BaseURL}${config.methods.Train.get}`, {
      method: "POST",
      body: JSON.stringify(ticketData),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((r) => {
        if(r.status === 200){
            setOpen(true);
            setMessage("Train Added Successfully");
            setSeverity("success");
            console.log("Response from Backend for adding new ticket: ", r);
        }else{
            setOpen(true);
            setMessage("Error Adding Train");
            setSeverity("error");
        }
        window.location = "/train-manage";
      })
      .catch((e) => {
        console.log("Error: ", e);
        setMessage("Error Adding Train");
        setSeverity("error");
        setOpen(true);
      });
  };

  const newData = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    console.log("name: ", value);

    setEntry((prevEntry) => ({
      ...prevEntry,
      [name]: updatedValue,
    }));
  };

  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <Header />
      <div className="parent">
        <div className="centered-div">
          <Container>
            <Typography variant="h4" gutterBottom>
              Add New Train
            </Typography>

            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Train Name"
              name="trainName"
              onChange={newData}
            />

            <div style={scrollableStyle}>
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "15px",
                  }}
                >
                  <Typography variant="h6">Schedule {index + 1}</Typography>
                  <TextField
                    required
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Origin"
                    name="origin"
                    value={schedule.origin}
                    onChange={(e) =>
                      handleScheduleChange(index, "origin", e.target.value)
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Origin Time"
                    name="originTime"
                    type="datetime-local"
                    value={schedule.originTime}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                      handleScheduleChange(index, "originTime", e.target.value)
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Destination"
                    name="destination"
                    value={schedule.destination}
                    onChange={(e) =>
                      handleScheduleChange(index, "destination", e.target.value)
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Destination Time"
                    name="destinationTime"
                    type="datetime-local"
                    value={schedule.destinationTime}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                      handleScheduleChange(
                        index,
                        "destinationTime",
                        e.target.value
                      )
                    }
                  />
                  <Button
                    color="secondary"
                    onClick={() => handleRemoveSchedule(index)}
                    style={{ marginTop: "10px" }}
                  >
                    Remove Schedule
                  </Button>
                </div>
              ))}
            </div>

            <Button onClick={addNewSchedule}>Add Schedule</Button>

            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="isActive-label">Status</InputLabel>
              <Select
                labelId="isActive-label"
                label="Status"
                name="status"
                value={entry.status}
                onChange={newData}
              >
                <MenuItem value={0}>Inactive</MenuItem>
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={2}>Published</MenuItem>
              </Select>
            </FormControl>

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
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
            {message}
        </Alert>
        </Snackbar>
    </div>
  );
}
