import CircularProgress from "@mui/material/CircularProgress";
import StandardWrapper from "./StandardWrapper";

export default function Spinner() {
  return (
    <StandardWrapper>
      <CircularProgress sx={{ width: "100%", margin: "0px auto" }} />
    </StandardWrapper>
  );
}
