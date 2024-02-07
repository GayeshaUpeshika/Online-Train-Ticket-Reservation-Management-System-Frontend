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

export default function EditTrain(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  // Local state for the train data
  const [entry, setEntry] = useState({
    id: "",
    trainName: "",
    schedule: [],
    status: 0,
  });

  const [ticket, setTicket] = useState({}); // Local state to store fetched ticket data
  const [rid, setRid] = useState(""); // Local state to store the train's ID

  // Function to update the train data on the server
  const updateTicket = () => {
    fetch(`${config.BaseURL}${config.methods.Train.get}/${rid}/edit-train`, {
      method: "PUT",
      body: JSON.stringify(entry),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((r) => {
        if(r.status === 200) {
            console.log("Response for updating a ticket: ", r);
            setOpen(true);
            setMessage("Train updated successfully!");
            setSeverity("success");
        } else {
            setOpen(true);
            setMessage("Error updating train!");
            setSeverity("error");
        }
        window.location = "/train-manage";
      })
      .catch((e) => {
        console.log("Error updating a ticket: ", e);
        setOpen(true);
        setMessage("Error updating train!");
        setSeverity("error");
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setMessage("");
  };

  // Function to handle input changes
  const newData = (e) => {
    const { name, value } = e.target;

    setEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  // UseEffect hook to fetch the train data when the component mounts
  useEffect(() => {
    let id_ = window.location.search;
    if (id_) {
      id_ = id_.split("=")[1];
    }

    if (id_) {
      setRid(id_);

      fetch(`${config.BaseURL}${config.methods.Train.get}/${id_}`)
        .then((r) => r.json())
        .then((d) => {
          setTicket(d);
          Object.assign(entry, d);
        })
        .catch((e) => {
            console.log("Error fetching ticket data: ", e);
            setOpen(true);
            setMessage("Error fetching train data!");
            setSeverity("error");
        });
    }
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Header />
      <div class="parent">
        <div class="centered-div">
          <Container>
            <Typography variant="h4" gutterBottom>
              Update Train
            </Typography>
            <label>Train Name</label>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="trainName"
              value={entry.trainName}
              onChange={newData}
            />

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
                onClick={() => (window.location = "/train-manage")}
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
            <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    </div>
  );
}
