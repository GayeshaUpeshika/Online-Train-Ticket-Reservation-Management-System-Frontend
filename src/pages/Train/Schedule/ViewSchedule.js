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
import urlConfig from "../../../utils/urlConfig";
import Header from "../../../components/Header";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const config = urlConfig();

const ViewSchedule = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  // State to control visibility of delete modal and the currently selected schedule for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // States for fetched schedules and train details
  const [schedules, setSchedules] = useState([]);
  const [train, setTrain] = useState([]);

  // Toggle the visibility of the delete confirmation modal
  const handleModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setMessage("");
  };

  // Opens the delete confirmation modal with the provided schedule
  const openDeleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  // Function to handle schedule deletion
  const deleteTicket = () => {
    if (!selectedSchedule) return; // Guard clause to check if a schedule has been selected

    fetch(
      `${config.BaseURL}${config.methods.Train.get}/${train.id}/delete-schedule/${selectedSchedule.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if(response.status === 200){
          setSeverity("success");
          setMessage("Schedule deleted successfully");
          setOpen(true);
          console.log("Response for deleting a schedule:", response);
          handleModal();
        }else{
          setSeverity("error");
          setMessage("Error deleting schedule");
          setOpen(true);
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting schedule:", error);
        setSeverity("error");
        setMessage("Error deleting schedule");
        setOpen(true);
      });
  };

  // On component mount, fetch train details and its schedules
  useEffect(() => {
    let id_ = window.location.search;
    if (id_) {
      id_ = id_.split("=")[1];
    }

    if (id_) {
      fetch(`${config.BaseURL}${config.methods.Train.get}/${id_}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Train details fetched:", data);
          setTrain(data);
          setSchedules(data.schedule);
        })
        .catch((error) =>
          console.error("Error fetching train details:", error)
        );
    }
  }, []);

  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <Header />
      <div class="parent">
        <div class="centered-div">
          <Container>
            <Typography variant="h4" gutterBottom>
              Train: {train.trainName}
            </Typography>

            {/* Add New Schedule Button */}
            <Button
              href={`/new-schedule?id=${train.id}`}
              variant="contained"
              color="primary"
              style={{ marginBottom: "16px" }}
            >
              New Schedule
            </Button>

            {/* Schedule Table */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Origin</TableCell>
                  <TableCell>Origin Time</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Destination Time</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((schedule, index) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.id}</TableCell>
                      <TableCell>{schedule.origin}</TableCell>
                      <TableCell>
                        {new Date(schedule.originTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{schedule.destination}</TableCell>
                      <TableCell>
                        {new Date(schedule.destinationTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`/edit-schedule?tid=${train.id}&sid=${schedule.id}`}
                        >
                          Edit
                        </a>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => openDeleteModal(schedule)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <TablePagination
              component="div"
              count={schedules.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPageOptions={[5]}
            />

            {/* Delete Confirmation Modal */}
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
                <div className="modal-item">
                  <h3>Delete Schedule</h3>
                  <p>Are you sure you want to delete this schedule?</p>
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
                </div>
              </Box>
            </Modal>
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
};

export default ViewSchedule;
