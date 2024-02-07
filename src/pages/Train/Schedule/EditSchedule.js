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

export default function EditSchedule(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  // State to store the schedule details
  const [scheduleDetails, setScheduleDetails] = useState({
    id: "",
    origin: "",
    originTime: "2023-10-06T15:48:07.126Z",
    destination: "",
    destinationTime: "2023-10-06T15:48:07.126Z",
  });

  // State to store the train ID from URL parameters
  const [trainID, setTrainID] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
        return;
    }
    setOpen(false);
    };

  // Handler to update schedule in the backend
  const handleUpdateSchedule = () => {
    fetch(
      `${config.BaseURL}${config.methods.Train.get}/${trainID}/edit-schedule/${scheduleDetails.id}`,
      {
        method: "PUT",
        body: JSON.stringify(scheduleDetails),
        headers: {
          "content-type": "application/json",
        },
      }
    )
      .then((response) => {
        if(response.status === 200){
            setOpen(true);
            setMessage("Schedule updated successfully!");
            setSeverity("success");
        } else {
            setOpen(true);
            setMessage("Error updating schedule!");
            setSeverity("error");
        }
        // Redirect to the train's detailed view after updating the schedule
        window.location = "/view-train?id=" + trainID;
      })
      .catch((error) => {
        console.error("Error updating the schedule: ", error);
        setOpen(true);
        setMessage("Error updating schedule!");
        setSeverity("error");
      });
  };

  // Handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Fetch the schedule data when the component mounts
    const params = new URLSearchParams(window.location.search);
    const tid = params.get("tid");
    const sid = params.get("sid");

    if (tid && sid) {
      setTrainID(tid);
      fetch(
        `${config.BaseURL}${config.methods.Train.get}/${tid}/schedule/${sid}`
      )
        .then((response) => response.json())
        .then((data) => {
          setScheduleDetails(data);
        })
        .catch((error) =>
          {
            console.error("Error fetching the schedule: ", error);
            setOpen(true);
            setMessage("Error fetching schedule!");
            setSeverity("error");
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
              Update Schedule
            </Typography>
            <TextField
              required
              variant="outlined"
              margin="normal"
              fullWidth
              label="Origin"
              name="origin"
              value={scheduleDetails.origin}
              onChange={handleInputChange}
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
              value={scheduleDetails.originTime.slice(0, 16)}
              onChange={handleInputChange}
            />
            <TextField
              required
              variant="outlined"
              margin="normal"
              fullWidth
              label="Destination"
              name="destination"
              value={scheduleDetails.destination}
              onChange={handleInputChange}
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
              value={scheduleDetails.destinationTime.slice(0, 16)}
              onChange={handleInputChange}
            />

            <Box mt={4} display="flex" justifyContent="space-between">
              <Button
                color="primary"
                onClick={() => (window.location = "/view-train?id=" + trainID)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateSchedule}
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
