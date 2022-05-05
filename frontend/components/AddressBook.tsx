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
import { abiFactory } from "../contracts/Factory";
import { abiOwnerManager } from "../contracts/OwnerManager";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";

import { Box, ButtonGroup, Divider, Typography } from "@mui/material";
import { getStorage } from "../utils/localStorage";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abiOwnerManager as any[], addr);

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

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "address",
      headerName: "Address",
      width: 150,
      editable: true,
      flex: 1,
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
                `https://ropsten.etherscan.io/address/${params.row.address}`
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
      <Grid item xs={12}>
        <Typography>The table of address book.</Typography>
      </Grid>
    </Grid>
  );
}
