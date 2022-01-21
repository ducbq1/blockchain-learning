import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function Statistic() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="palm_trees_sunset_clouds_135077_2048x1152.jpg"
            alt=""
            loading="lazy"
            width="1200"
            height="600"
          />
        </Box>
      </Container>
    </React.Fragment>
  );
}
