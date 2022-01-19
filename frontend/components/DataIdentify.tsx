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
import { abi } from "../contracts/ChainIdentification";
import { addressContract } from "../contracts/AddressContract";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";

import { Box, ButtonGroup, Typography } from "@mui/material";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abi as any[], addr);

export default function DataTable() {
  const myContract = initContract(addressContract);

  const [age, setAge] = React.useState<string | number>("");
  const [dataSelect, setDataSelect] = React.useState([]);
  const [dataSelected, setDataSelected] = React.useState<string>("");
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const { messageContext, accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [accounts, setAccounts] = accountContext;
  const [loading, setLoading] = React.useState(false);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "uuid", headerName: "UUID", width: 60, hide: true },
    {
      field: "message",
      headerName: "Message",
      width: 200,
      sortable: false,
      flex: 1,
    },
    { field: "network", headerName: "Infural Network", width: 150 },
    {
      field: "address",
      headerName: "Address",
      width: 370,
      description: "This column has a value of address",
    },
    {
      field: "scan",
      headerName: "Scan",
      width: 70,
      sortable: false,
      disableColumnMenu: true,
      align: "center",
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
    {
      field: "isVerify",
      headerName: "Status",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => {
        if (params.row.isVerify) {
          return <GppGoodIcon color="success" />;
        } else {
          return <GppMaybeIcon color="secondary" />;
        }
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      align: "center",

      renderCell: (params) => {
        if (params.row.isVerify) {
          return (
            <Button
              variant="text"
              onClick={() =>
                handleDeactiveAccount(params.row.address, params.row.uuid)
              }
            >
              Deactive
            </Button>
          );
        } else {
          return (
            <Button
              variant="text"
              onClick={() =>
                handleActiveAccount(params.row.address, params.row.uuid)
              }
            >
              Active
            </Button>
          );
        }
      },
    },
  ];

  const handleActiveAccount = async (address: string, uuid: string) => {
    setLoading(true);
    try {
      const isDone = await myContract.methods
        .recoverAddress(dataSelected.split("&")[1], address)
        .send({ from: accounts[0] });
      if (isDone) {
        await axios.put(`http://${window.location.hostname}:4000/addresses`, {
          id: uuid,
          isVerify: true,
        });
        axios
          .get(
            `http://${window.location.hostname}:4000/identifies/addresses/${
              dataSelected.split("&")[0]
            }`
          )
          .then((response) => {
            setRows(
              response.data.map(
                (item: {
                  id: string;
                  uuid: string;
                  message: string;
                  infuralNetworks: string;
                  address: string;
                  isVerify: boolean;
                }) => ({
                  id: response.data.indexOf(item) + 1,
                  uuid: item.id,
                  network: item.infuralNetworks,
                  message: item.message.substring(0, 30).concat("..."),
                  address: item.address,
                  isVerify: item.isVerify,
                })
              )
            );
          });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      window.console.error(err);
    }
  };

  const handleDeactiveAccount = async (address: string, uuid: string) => {
    setLoading(true);
    try {
      const isDone = await myContract.methods
        .rejectAddress(dataSelected.split("&")[1], address)
        .send({ from: accounts[0] });

      if (isDone) {
        await axios.put(`http://${window.location.hostname}:4000/addresses`, {
          id: uuid,
          isVerify: false,
        });
        axios
          .get(
            `http://${window.location.hostname}:4000/identifies/addresses/${
              dataSelected.split("&")[0]
            }`
          )
          .then((response) => {
            setRows(
              response.data.map(
                (item: {
                  id: string;
                  uuid: string;
                  message: string;
                  infuralNetworks: string;
                  address: string;
                  isVerify: boolean;
                }) => ({
                  id: response.data.indexOf(item) + 1,
                  uuid: item.id,
                  network: item.infuralNetworks,
                  message: item.message.substring(0, 30).concat("..."),
                  address: item.address,
                  isVerify: item.isVerify,
                })
              )
            );
          });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleLog = () => {
    myContract.methods
      .get(dataSelected.split("&")[1])
      .call()
      .then((result: any) => console.log(result));
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      const isDone = await myContract.methods
        .remove(dataSelected.split("&")[1])
        .send({ from: accounts[0] });

      if (isDone) {
        await axios.delete(
          `http://${window.location.hostname}:4000/identifies/${
            dataSelected.split("&")[0]
          }`
        );
        axios
          .get(
            `http://${window.location.hostname}:4000/addresses/identify/${accounts[0]}`
          )
          .then((response) => {
            setDataSelect(response.data);
          });
      }
      setRows([]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (accounts.length < 0) {
      setDataSelect([]);
      return;
    }

    try {
      axios
        .get(
          `http://${window.location.hostname}:4000/addresses/identify/${accounts[0]}`
        )
        .then((response) => {
          setDataSelect(response.data);
        });
    } catch (err) {
      console.error(err);
    }
  }, [accounts]);

  const handleChange = (event: SelectChangeEvent<typeof dataSelected>) => {
    let catchValue = event.target.value;
    let id = catchValue.split("&")[0];
    setDataSelected(catchValue);
    axios
      .get(`http://${window.location.hostname}:4000/identifies/addresses/${id}`)
      .then((response) => {
        setRows(
          response.data.map(
            (item: {
              id: string;
              uuid: string;
              message: string;
              infuralNetworks: string;
              address: string;
              isVerify: boolean;
            }) => ({
              id: response.data.indexOf(item) + 1,
              uuid: item.id,
              network: item.infuralNetworks,
              message: item.message.substring(0, 30).concat("..."),
              address: item.address,
              isVerify: item.isVerify,
            })
          )
        );
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    console.log(dataSelect);
  };
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={4}>
        <FormControl sx={{ my: 1, width: 300 }}>
          <InputLabel id="demo-controlled-open-select-label">
            Identification
          </InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={dataSelected}
            label="Identification"
            onChange={handleChange}
          >
            {dataSelect.map((item, index) => {
              let mergeId = item.id + "&" + item.combineId;
              return (
                <MenuItem key={index} value={mergeId}>
                  {item.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <Grow
          in={loading}
          style={{ transformOrigin: "0 0 0" }}
          {...(loading ? { timeout: 1000 } : {})}
        >
          <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
            <LinearProgress color="secondary" />
            <LinearProgress color="success" />
            <LinearProgress color="inherit" />
          </Stack>
        </Grow>
      </Grid>
      <Grid item xs={4}>
        <Zoom in={dataSelected.length > 0}>
          <ButtonGroup
            sx={{ mr: 0 }}
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button>ID: #{dataSelected.split("&")[1]}</Button>
            <Button onClick={handleLog}>LOG</Button>
            <Button color="secondary" onClick={handleRemove}>
              REMOVE
            </Button>
          </ButtonGroup>
        </Zoom>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 270, width: "100%" }}>
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
        <img
          src="sea_rocks_moss_132634_1280x720clone.jpg"
          alt=""
          loading="lazy"
          height="230"
          width="100%"
        />
      </Grid>
    </Grid>
  );
}
