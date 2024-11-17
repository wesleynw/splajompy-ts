import React from "react";
import { CircularProgress, Box } from "@mui/material";

const LoadingIcon = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
    <CircularProgress />
  </Box>
);

export default LoadingIcon;
