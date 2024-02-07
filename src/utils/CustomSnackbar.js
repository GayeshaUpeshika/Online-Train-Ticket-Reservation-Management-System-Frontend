import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React from "react";

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const CustomSnackbar = ({ msg, severity }) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    );
};

// Use like:
// <CustomSnackbar msg="Information message" severity="info" />
// <CustomSnackbar msg="Error message" severity="error" />

export { CustomSnackbar };
