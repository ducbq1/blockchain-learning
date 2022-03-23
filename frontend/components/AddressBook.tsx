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
import { factoryAddress } from "../contracts/FactoryAddress";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";

import { Box, ButtonGroup, Divider, Typography } from "@mui/material";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abiOwnerManager as any[], addr);

export default function DataTable() {
  const myContract = initContract(factoryAddress);
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

  /*
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
  */

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
      headerName: "Action",
      type: "number",
      width: 110,
      editable: true,
    },
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    // },
  ];

  // const rows = [
  //   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  //   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  //   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  //   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  //   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  //   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  //   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  //   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  //   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  // ];

  /*
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "uuid", headerName: "UUID", width: 60, hide: true },
    // {
    //   field: "message",
    //   headerName: "Message",
    //   width: 200,
    //   sortable: false,
    //   flex: 1,
    // },
    {
      field: "address",
      headerName: "Address",
      width: 370,
      description: "This column has a value of address",
      flex: 1,
    },
    { field: "balance", headerName: "Balance", width: 150 },
    {
      field: "transactionCount",
      headerName: "Transaction Count",
      width: 150,
      align: "center",
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
    // {
    //   field: "isVerify",
    //   headerName: "Status",
    //   width: 80,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   align: "center",
    //   renderCell: (params) => {
    //     if (params.row.isVerify) {
    //       return <GppGoodIcon color="success" />;
    //     } else {
    //       return <GppMaybeIcon color="secondary" />;
    //     }
    //   },
    // },
    {
      field: "action",
      headerName: "Action",
      width: 210,
      sortable: false,
      // align: "center",
      renderCell: (params) => {
        return (
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button>Replace</Button>
            <Button color="secondary">Remove</Button>
          </ButtonGroup>
        );
        // if (params.row.isVerify) {
        //   return (
        //     <Button
        //       variant="text"
        //       onClick={() =>
        //         handleDeactiveAccount(params.row.address, params.row.uuid)
        //       }
        //     >
        //       Deactive
        //     </Button>
        //   );
        // } else {
        //   return (
        //     <Button
        //       variant="text"
        //       onClick={() =>
        //         handleActiveAccount(params.row.address, params.row.uuid)
        //       }
        //     >
        //       Active
        //     </Button>
        //   );
        // }
      },
    },
  ];
  */

  const handleRemoveList = () => {};
  const handleAddOwner = () => {};

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
    const removeAccount = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "removeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      ["0x3AA528B07d997b2E78e7BFB96fdFB7CA31cE0e46"]
    );
    console.log(removeAccount);
    initContract(dataSelected)
      .methods.implementTransaction(dataSelected, 0, removeAccount, signature)
      .send({ from: accounts[0] })
      .on("receipt", (receipt) => {
        console.log(receipt);
      });

    console.log(signature);

    // web3.eth.sendTransaction({
    //   from: accounts[0],
    //   to: dataSelected,
    //   data: removeAccount,
    // });
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
    // if (accounts.length < 0) {
    //   setDataSelect([]);
    //   return;
    // }

    setRows(
      JSON.parse(window.localStorage.getItem("addressBook")).map(
        (item, index) => ({
          id: index,
          address: item.address,
          type: item.type,
        })
      )
    );

    console.log(
      web3.eth.abi.encodeFunctionCall(
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "removeOwner",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        ["0x3AA528B07d997b2E78e7BFB96fdFB7CA31cE0e46"]
      )
    );

    const array_address = ["0x5D5658bC43eF9becdA2671C9F9b5Ad53aDB45125"];

    for (let i = 0; i < array_address.length; i++) {
      initContract(array_address[i])
        .methods.getOwners()
        .call()
        .then((result) => console.log(result));
    }

    setDataSelect(
      array_address.map((item, index) => ({
        title: "Account " + index,
        account: item,
      }))
    );

    // try {
    //   axios
    //     .get(
    //       `http://${window.location.hostname}:4000/addresses/identify/${accounts[0]}`
    //     )
    //     .then((response) => {
    //       setDataSelect(response.data);
    //     });
    // } catch (err) {
    //   console.error(err);
    // }
  }, [accounts]);

  const handleChange = async (
    event: SelectChangeEvent<typeof dataSelected>
  ) => {
    // let catchValue = event.target.value;
    setDataSelected(event.target.value);
    initContract(event.target.value)
      .methods.getOwners()
      .call()
      .then(async (result) => {
        setRows(
          await Promise.all(
            result.map(async (item, index) => {
              return {
                id: index,
                uuid: item,
                balance: web3.utils.fromWei(
                  await web3.eth.getBalance(item),
                  "ether"
                ),
                message: item.substring(0, 30).concat("..."),
                address: item,
                transactionCount: await web3.eth.getTransactionCount(item),
                isVerify: 0,
              };
            })
          )
        );
      });
    // axios
    //   .get(`http://${window.location.hostname}:4000/identifies/addresses/${id}`)
    //   .then((response) => {
    //     setRows(
    //       response.data.map(
    //         (item: {
    //           id: string;
    //           uuid: string;
    //           message: string;
    //           infuralNetworks: string;
    //           address: string;
    //           isVerify: boolean;
    //         }) => ({
    //           id: response.data.indexOf(item) + 1,
    //           uuid: item.id,
    //           network: item.infuralNetworks,
    //           message: item.message.substring(0, 30).concat("..."),
    //           address: item.address,
    //           isVerify: item.isVerify,
    //         })
    //       )
    //     );
    //   });
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

    console.log(addressStorage.getItem("addressBook"));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={12}>
        <ButtonGroup variant="outlined">
          <Button>Export</Button>
          <Button>Import</Button>
          <Button onClick={handleCreateEntry}>Create Entry</Button>
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
