import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import axios from "axios";
import { InferGetServerSidePropsType } from "next";
import { GetServerSideProps } from "next";
import { StoreContext } from "../store";

function MediaCard({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Card sx={{ maxWidth: 1000 }}>
      <CardMedia
        component="img"
        height="200"
        image="104939467-Blockchain_Industry_Thumb_00000.jpg"
        alt="green iguana"
      />
      <CardContent>
        <Divider />
        <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>
          Identification
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Controlled by Keys. Has Claims, can add Claims to other identities.
        </Typography>
        <Divider />
        <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>
          Asset Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Also an Identity. Trusted by Protected Contracts to certify Identities
          with Claims.
        </Typography>
        <Divider />
        <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>
          Statistic
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A contract only allowing interactions from Identites holding Claims
          from a trusted issuer.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get(
    `http://${window.location.hostname}:4000/identifies`
  );

  return {
    props: {
      data: res.data,
    },
  };
};

export default MediaCard;
