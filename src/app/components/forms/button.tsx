import { Button, styled } from "@mui/material";

export const StyledButton = styled(Button)(() => ({
  textTransform: "none",
  borderRadius: "10px",
  padding: "8px 16px",
  fontWeight: "bold",
  fontSize: "0.875rem",
  backgroundColor: "#1DA1F2",
  color: "#ffffff",
  marginTop: "20px",
  width: "100%",
  "&:hover": {
    backgroundColor: "#0d8de6",
  },
}));
