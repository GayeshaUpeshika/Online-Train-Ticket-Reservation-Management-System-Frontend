import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Container,
  Modal,
  Box,
} from "@mui/material";
import urlConfig from "../utils/urlConfig";
import Header from "../components/Header";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Obtain API endpoint configurations
const config = urlConfig();

// Status mapping for train status with labels and colors for visual representation
const STATUS_MAP = {
  0: { label: "Inactive", color: "red" },
  1: { label: "Active", color: "green" },
  2: { label: "Published", color: "blue" },
};

// Component to display the status label with corresponding color based on the status code
const StatusLabel = ({ code }) => {
  const status = STATUS_MAP[code];

  if (!status) {
    return <span>Invalid Status</span>;
  }

  return <span style={{ color: status.color }}>{status.label}</span>;
};

const TrainManage = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  // States for modal visibility, pagination, list of trains, and the selected train's ID
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [trains, setTrains] = useState([]);
  const [trainId, setTrainId] = useState("");

  // Toggle function to show/hide the delete modal
  const handleModal = () => {
    setShowDeleteModal((prevState) => !prevState);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setMessage("");
  };

  // Opens the delete modal and sets the train ID for deletion
  const openDeleteModal = (id) => {
    setTrainId(id);
    handleModal();
  };

  // Function to send the delete request for the selected train
  const deleteTrain = () => {
    fetch(`${config.BaseURL}${config.methods.Train.get}/${trainId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          handleModal();
          setOpen(true);
          setMessage("Train deleted successfully");
          setSeverity("success");
          window.location.reload();
        } else {
          console.error("Error deleting the train");
          setMessage("Error deleting the train");
          setSeverity("error");
          setOpen(true);
        }
      })
      .catch((e) => {
        console.error("Error deleting a train: ", e);
        setMessage("Error deleting the train");
        setSeverity("error");
        setOpen(true);
      });
  };

  // Fetch all trains once the component is mounted
  useEffect(() => {
    fetch(`${config.BaseURL}${config.methods.Train.get}`)
      .then((response) => response.json())
      .then((data) => {
        setTrains(data);
      })
      .catch((e) => {
        console.error("Error fetching trains: ", e);
        setMessage("Error fetching trains");
        setSeverity("error");
        setOpen(true);
      });
  }, []);

  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          Train Manager
        </Typography>
        <Button
          href="/new-train"
          variant="contained"
          color="primary"
          style={{ marginBottom: "16px" }}
        >
          New Train
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Train Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trains
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((train) => (
                <TableRow key={train.id}>
                  <TableCell>{train.trainName}</TableCell>
                  <TableCell>{train.id}</TableCell>
                  <TableCell>
                    <a href={"/view-train?id=" + train.id}>View</a>
                  </TableCell>
                  <TableCell>
                    <StatusLabel code={train.status} />
                  </TableCell>
                  <TableCell>
                    <a href={"/edit-train?id=" + train.id}>Edit</a>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => openDeleteModal(train.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={trains.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5]}
        />
        <Modal open={showDeleteModal} onClose={handleModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Delete Train
            </Typography>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this train?
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteTrain}
              >
                Confirm Delete
              </Button>
              <Button
                variant="outlined"
                style={{ marginLeft: "16px" }}
                onClick={handleModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TrainManage;
