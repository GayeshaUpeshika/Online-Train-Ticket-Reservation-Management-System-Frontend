import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Import main pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditUser from "./pages/EditUser";
// Import ProtectedRoute component for route protection
import ProtectedRoute from "./components/ProtectedRoute";

// Import main management pages
import TravelerManage from "./pages/TravelerManage";
import TicketManage from "./pages/TicketManage";
import TrainManage from "./pages/TrainManage";

// Import traveler management related pages
import CreateTravelerForm from "./pages/Traveler/CreateTravelerForm";
import EditTraveler from "./pages/Traveler/EditTraveler";
import ViewTravelerProfile from "./pages/Traveler/ViewTravelerProfile";

// Import ticket management related pages
import NewTicket from "./pages/Ticket/NewTicket";
import EditTicket from "./pages/Ticket/EditTicket";

// Import train management related pages
import ViewSchedule from "./pages/Train/Schedule/ViewSchedule";
import EditTrain from "./pages/Train/EditTrain";
import NewTrain from "./pages/Train/NewTrain";

// Import train schedule related pages
import NewSchedule from "./pages/Train/Schedule/NewSchedule";
import EditSchedule from "./pages/Train/Schedule/EditSchedule";

// Import main styles
import "./styles/main.css";

function App() {
  // State for token; getToken from localStorage, though the getter is not used here
  const [, setToken] = useState(localStorage.getItem("jwt"));

  return (
    <BrowserRouter>
      <Routes>
        {/* Route for Login page */}
        <Route path="/login" element={<Login setToken={setToken} />} />

        {/* Route for Register page */}
        <Route path="/register" element={<Register />} />

        {/* Protected routes ensure the user is authenticated */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/traveler-manage"
          element={
            <ProtectedRoute>
              <TravelerManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user"
          element={
            <ProtectedRoute>
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket-manage"
          element={
            <ProtectedRoute>
              <TicketManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/train-manage"
          element={
            <ProtectedRoute>
              <TrainManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-traveler"
          element={
            <ProtectedRoute>
              <CreateTravelerForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-traveler"
          element={
            <ProtectedRoute>
              <EditTraveler />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-traveler"
          element={
            <ProtectedRoute>
              <ViewTravelerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-ticket"
          element={
            <ProtectedRoute>
              <NewTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-ticket"
          element={
            <ProtectedRoute>
              <EditTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-train"
          element={
            <ProtectedRoute>
              <ViewSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-train"
          element={
            <ProtectedRoute>
              <EditTrain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-train"
          element={
            <ProtectedRoute>
              <NewTrain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-schedule"
          element={
            <ProtectedRoute>
              <NewSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-schedule"
          element={
            <ProtectedRoute>
              <EditSchedule />
            </ProtectedRoute>
          }
        />

        {/* Default route to login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
