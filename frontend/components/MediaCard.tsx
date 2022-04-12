import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CREATE, LOAD_EXIST } from "../utils/constant";
import { useRouter } from "next/router";

export default function MediaCard(props: { name: string; action: string }) {
  const router = useRouter();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image="104939467-Blockchain_Industry_Thumb_00000.jpg"
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.name == CREATE &&
            "Create a new wallet that is controlled by one or multiple owners. You will be required to pay a network fee for creating your new wallet."}
          {props.name == LOAD_EXIST &&
            "Already have a wallet or want to access it from a different device? Easily load your wallet using your wallet address."}
        </Typography>
      </CardContent>
      <CardActions>
        {props.name == CREATE && (
          <Button
            size="small"
            onClick={() => {
              router.push(`/create`);
              // window.location.href = `http://${window.location.hostname}:3000/open`;
            }}
          >
            Create New
          </Button>
        )}
        {props.name == LOAD_EXIST && (
          <Button
            size="small"
            onClick={() => {
              router.push(`/load`);
              // window.location.href = `http://${window.location.hostname}:3000/load`;
            }}
          >
            Add Existing
          </Button>
        )}
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
