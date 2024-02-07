/* eslint-disable no-unused-vars */
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
// Get API endpoint configurations
const config = urlConfig();

const TicketManage = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  // Local state variables for modal visibility, pagination, list of tickets, and selected ticket ID
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [tickets, setTickets] = useState([]);
  const [train, setTrain] = useState([]);
  const [ticketId, setTicketId] = useState("");

  // Toggle the visibility of the delete modal
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

  // Open the delete modal and set the ticket ID for deletion
  const openDeleteModal = (id) => {
    setTicketId(id);
    handleModal();
  };

  // Send the delete request for the selected ticket
  const deleteTicket = () => {
    fetch(`${config.BaseURL}${config.methods.Ticket.get}/${ticketId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          handleModal();
          setOpen(true);
          setMessage("Ticket deleted successfully");
          setSeverity("success");
          window.location.reload();
        } else {
          setMessage("Error deleting the ticket");
          setSeverity("error");
          setOpen(true);
          console.error("Error deleting the ticket");
        }
      })
      .catch((e) => console.error("Error deleting a ticket: ", e));
  };

  // Fetch all tickets and trains when the component mounts
  useEffect(() => {
    // Fetching trains
    fetch(`${config.BaseURL}${config.methods.Train.get}`)
      .then((response) => response.json())
      .then((data) => {
        setTrain(data);
      })
      .catch((e) => {
        console.error("Error fetching trains: ", e);
        setMessage("Error fetching trains");
        setSeverity("error");
        setOpen(true);
      });

    // Fetching tickets
    fetch(`${config.BaseURL}${config.methods.Ticket.get}`)
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((e) => {
        console.error("Error fetching tickets: ", e);
        setMessage("Error fetching tickets");
        setSeverity("error");
        setOpen(true);
      });
  }, []);

  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          Ticket Manager
        </Typography>
        <Button
          href="/traveler-manage"
          variant="contained"
          color="primary"
          style={{ marginBottom: "16px" }}
        >
          New Ticket
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Traveler NIC</TableCell>
              <TableCell>Train</TableCell>
              <TableCell>Reservation Date</TableCell>
              <TableCell>Reference ID</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.travelerNIC}</TableCell>
                  <TableCell>{ticket.trainId}</TableCell>
                  <TableCell>{ticket.reservationDate.split("T")[0]}</TableCell>
                  <TableCell>{ticket.referenceID}</TableCell>
                  <TableCell>
                    <a href={"/edit-ticket?id=" + ticket.id}>Edit</a>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => openDeleteModal(ticket.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={tickets.length}
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
            <h3>Delete Ticket</h3>
            <p>Are you sure you want to delete this ticket?</p>
            <div className="row mt-20 justify-btw">
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteTicket}
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
            </div>
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

export default TicketManage;
