import * as React from "react";
import { Grid, Typography } from "@mui/material";
import MediaCard from "./MediaCard";
import { CREATE, LOAD_EXIST, WELCOME } from "../utils/constant";
import Import from "./Import";

export default function FullWidthGrid() {
  return (
    <React.Fragment>
      {/* <MediaCard name={CREATE} action="" /> */}
      <Import />
    </React.Fragment>
  );
}
