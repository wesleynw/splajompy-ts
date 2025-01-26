import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function FeedBottom() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      margin="0 auto"
      width="100%"
      maxWidth="600px"
      height="30vh"
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          color: "#777777",
          paddingBottom: 2,
        }}
      >
        Is that the very first post? <br />
        What came before that? <br />
        Nothing at all? <br />
        It always just{" "}
        <Box fontWeight="800" display="inline">
          Splajompy
        </Box>
        .
      </Typography>
    </Box>
  );
}
