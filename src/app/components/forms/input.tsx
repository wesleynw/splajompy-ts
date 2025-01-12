import { Input, styled } from "@mui/material";

export const StyledInput = styled(Input)(({ theme }) => ({
  width: "100%",
  fontSize: "0.875rem",
  fontWeight: 400,
  padding: "8px 12px",
  margin: "8px 0px",
  borderRadius: "8px",
  color: theme.palette.grey[300],
  background: theme.palette.grey[900],
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
  "&:focus": {
    outline: 0,
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.primary.dark}`,
  },
  border: `1px solid ${theme.palette.grey[700]}`,
  boxShadow: `0 2px 2px ${theme.palette.grey[900]}`,
}));
