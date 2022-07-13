import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import axios from "axios";
import { StoreContext } from "../store";
import Grid from "@mui/material/Grid";
import Zoom from "@mui/material/Zoom";
import Link from "next/link";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import PageviewIcon from "@mui/icons-material/Pageview";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import GppGoodIcon from "@mui/icons-material/GppGood";
import Web3 from "web3";
import { OwnerManagerFactory } from "../contracts/OwnerManagerFactory";
import { OwnerManager } from "../contracts/OwnerManager";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";

import { Box, ButtonGroup, Divider, Typography } from "@mui/material";
import { getStorage } from "../utils/localStorage";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(OwnerManager as any[], addr);

export default function DataTable() {
  const { accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [signature, setSignature] = signatureContext;

  const [age, setAge] = React.useState<string | number>("");
  const [dataSelect, setDataSelect] = React.useState([]);
  const [dataSelected, setDataSelected] = React.useState<string>("");
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const [accounts, setAccounts] = accountContext;
  const [loading, setLoading] = React.useState(false);

  const itemDataImage = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
    },
    {
      img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      title: "Basketball",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      title: "Tomato basil",
    },
    {
      img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      title: "Sea star",
    },
    {
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      title: "Bike",
    },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "address",
      headerName: "Address",
      width: 150,
      editable: true,
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={{ borderRadius: "50%", overflow: "hidden", width: 35 }}
              src={`${
                itemDataImage[Math.floor(Math.random() * itemDataImage.length)]
                  .img
              }?w=164&h=164&fit=crop&auto=format`}
              alt="Image Account"
              loading="lazy"
            />
            &nbsp; &nbsp;
            {params.row.address}
          </div>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 200,
      editable: true,
    },
    {
      field: "action",
      headerName: "Scan",
      // type: "number",
      align: "center",

      width: 70,
      // editable: true,
      renderCell: (params) => {
        return (
          <PageviewIcon
            color="primary"
            onClick={() => {
              window.open(
                `https://kovan.etherscan.io/address/${params.row.address}`
              );
            }}
          />
        );
      },
    },
  ];

  React.useEffect(() => {
    if (getStorage("addressBook") !== null) {
      setRows(
        getStorage("addressBook").map((item, index) => ({
          id: index,
          address: item.address,
          type: item.type,
          scan: item.address,
        }))
      );
    }
  }, [accounts]);

  const handleClearEntry = () => {
    const addressStorage = window.localStorage;
    addressStorage.removeItem("addressBook");
    addressStorage.setItem("addressBook", "[]");
  };

  const handleCreateEntry = () => {
    const addressStorage = window.localStorage;
    const addressBook = [
      {
        address: "0xDae4F717B611A34Ffb92a6704073a87Dc71693FB",
        type: "Externally Owned Accounts",
      },
      {
        address: "0xFdd57658465a46125327D7e786411530C985FEa8",
        type: "Externally Owned Accounts",
      },
      {
        address: "0xa5832a9016Ce74829b99b661Bc4B23F622888757",
        type: "Contract Accounts",
      },
      {
        address: "0x8B6ff17E6a61879661296CBA916BeC85F6649062",
        type: "Externally Owned Accounts",
      },
    ];
    addressStorage.setItem("addressBook", JSON.stringify(addressBook));

    // console.log(getStorage("addressBook"));
  };

  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={12}>
        <ButtonGroup variant="outlined">
          <Button onClick={handleClearEntry}>Clear</Button>
          {/* <Button>Export</Button>
          <Button>Import</Button>
          <Button onClick={handleCreateEntry}>Create Entry</Button> */}
        </ButtonGroup>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ height: 370, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Box>
      </Grid>
      {/* <Grid item xs={12}>
        <Typography>The table of address book.</Typography>
      </Grid> */}
    </Grid>
  );
}
