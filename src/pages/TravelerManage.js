import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Modal,
  Typography,
  Box,
} from "@mui/material";
import urlConfig from "../utils/urlConfig";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// Get API endpoint configurations
const config = urlConfig();

const TravelerManage = () => {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
  // State for storing traveler details, NIC, delete modal visibility, and current page number
  const [travelers, setTravelers] = useState([]);
  const [nic, setNIC] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Toggles the delete modal's visibility
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

  // Opens the delete modal and sets the NIC of the traveler to be deleted
  const openDeleteModal = (nic) => {
    setNIC(nic);
    handleModal(false);
  };

  // Function to delete a traveler using its NIC
  const deleteTraveler = () => {
    fetch(`${config.BaseURL}${config.methods.Traveler.get}/${nic}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Traveler deleted successfully.");
          handleModal(true);
          setMessage("Traveler deleted successfully.");
            setSeverity("success");
            setOpen(true);
          window.location.reload();
        } else {
          console.log("Failed to delete traveler.");
            setMessage("Failed to delete traveler.");
            setSeverity("error");
            setOpen(true);
          // Potential enhancement: Display a user-friendly error message
        }
      })
      .catch((error) => {
        console.error("Error deleting a traveler: ", error);
            setMessage("Error deleting a traveler.");
            setSeverity("error");
            setOpen(true);
        // Potential enhancement: Handle the error more gracefully, e.g., show an error notification
      });
  };

  // Fetch all travelers when the component mounts
  useEffect(() => {
    fetch(`${config.BaseURL}${config.methods.Traveler.get}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("The travelers are: ", data);
        setTravelers(data);
      })
      .catch((error) => {
        console.log("Error fetching all travelers: ", error);
        setMessage("Error fetching all travelers.");
            setOpen(true);
            setSeverity("error");
        // Potential enhancement: Display an error message to the user
      });
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Header />
      <Box component="main" p={3}>
        <Typography variant="h4" gutterBottom>
          Traveler Manager
        </Typography>
        <Button
          href="/new-traveler"
          variant="contained"
          color="primary"
          style={{ marginBottom: "16px" }}
        >
          Add Traveler
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>NIC</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Reservation</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {travelers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((traveler) => (
                <TableRow key={traveler.nic}>
                  <TableCell>{traveler.firstName}</TableCell>
                  <TableCell>{traveler.lastName}</TableCell>
                  <TableCell>{traveler.email}</TableCell>
                  <TableCell>{traveler.nic}</TableCell>
                  <TableCell>
                    <a href={`/edit-traveler?nic=${traveler.nic}`}>Edit</a>
                  </TableCell>
                  <TableCell>
                    <a href={`/view-traveler?nic=${traveler.nic}`}>View</a>
                  </TableCell>
                  <TableCell>
                    <a href={`/new-ticket?nic=${traveler.nic}`}>Reservation</a>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => openDeleteModal(traveler.nic)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={travelers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5]}
        />

        <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
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
              Delete Traveler
            </Typography>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this traveler?
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteTraveler}
              >
                Confirm Delete
              </Button>
              <Button
                variant="outlined"
                style={{ marginLeft: "16px" }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
            {message}
            </Alert>
        </Snackbar>
    </div>
  );
};

export default TravelerManage;