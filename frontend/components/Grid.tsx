import * as React from "react";
import { Grid } from "@mui/material";
import { StoreContext } from "../store";
import Card from "./Card";
import Import from "./Import";

export default function FullWidthGrid() {
  const { addressContext } = React.useContext(StoreContext);
  const [address, setAddress] = addressContext;
  const itemIdentification = [];

  address.forEach((item: any) => {
    itemIdentification.push({
      active: true,
      name: item.slice(0, 4),
      address: item.slice(4),
    });
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={8} md={7}>
        <React.Fragment>
          <Import item={itemIdentification} />
        </React.Fragment>
      </Grid>
      <Grid item xs={4} md={5}>
        <React.Fragment>
          <Card />
        </React.Fragment>
      </Grid>
    </Grid>
  );
}
