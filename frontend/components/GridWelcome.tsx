import * as React from "react";
import { Grid, Typography } from "@mui/material";
import { StoreContext } from "../store";
import Import from "./Import";
import MediaCard from "./MediaCard";
import { CREATE, LOAD_EXIST } from "../utils/constant";

export default function FullWidthGrid() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4} md={4}>
          <React.Fragment>
            {/* <Import item={address} /> */}
            <MediaCard name={CREATE} action="" />
          </React.Fragment>
        </Grid>
        <Grid item xs={4} md={4}>
          <React.Fragment>
            <MediaCard name={LOAD_EXIST} action="" />
          </React.Fragment>
        </Grid>
      </Grid>
    </>
  );
}
