import React from "react";
import { Typography, Container, Paper, Box, Avatar, Button } from "@mui/material";
import Header from "../components/Header";
import getUser from "../utils/getUser";
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

// Importing local images
import img1 from '../resources/1.jpg';
import img2 from '../resources/2.webp';
import img3 from '../resources/3.jpg';

const images = [img1, img2, img3];


const Dashboard = () => {
  // Fetch the user details from the utility function
  const user = getUser();

  return (
    <div style={{ position: "relative" }}>
      {/* Header component */}
      <Header />

      {/* Slideshow to fill entire page background */}
      <div
        className="slide-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <Zoom scale={0.4}>
          {images.map((each, index) => (
            <img
              key={index}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              src={each}
            />
          ))}
        </Zoom>
      </div>

      {/* Main content on top of the slideshow */}
      <Container component="main" maxWidth="md" style={{ marginTop: "5px" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="60vh"
        >
          <Paper
            elevation={3}
            style={{
              padding: "50px",
              borderRadius: "15px",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Slight transparency so background is visible
            }}
          >
            <Avatar
              src="https://cdn-icons-png.flaticon.com/512/6784/6784004.png"
              alt={user.name}
              style={{
                width: "100px",
                height: "100px",
                marginBottom: "10px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <Typography component="h2" variant="h5">
              {"Name: " + user.name}
            </Typography>
            <Typography component="h2" variant="h5">
              {"Email: " + user.email}
            </Typography>
            <Typography component="h2" variant="h5">
              {"Role: " + user.role}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              href="/edit-user"
            >
              Update User
            </Button>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;
