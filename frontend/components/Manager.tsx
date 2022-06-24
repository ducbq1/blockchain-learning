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
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  ButtonGroup,
  Divider,
  InputAdornment,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import TripOriginIcon from "@mui/icons-material/TripOrigin";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abiOwnerManager as any[], addr);

export default function Manager() {
  const REMOVE_OWNER = "Remove Owner";
  const ADD_OWNER = "Add Owner";
  const REPLACE_OWNER = "Replace Owner";
  const SUBMIT_TRANSACTION = "Submit Transaction";
  const CHANGE_THRESHOLD = "Change Threshold";

  const { accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [signature, setSignature] = signatureContext;

  const [age, setAge] = React.useState<string | number>("");
  const [dataSelect, setDataSelect] = React.useState([]);
  const [dataSelected, setDataSelected] = React.useState<string>("");
  const [rowsOwners, setRowsOwners] = React.useState([]);
  const [require, setRequire] = React.useState(1);
  const [newRequirement, setNewRequirement] = React.useState("1");
  const [rowsTransactions, setRowsTransactions] = React.useState([]);
  const [openFormControl, setOpenFormControl] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [action, setAction] = React.useState("");

  const [oldOwner, setOldOwner] = React.useState("");
  const [newOwner, setNewOwner] = React.useState("");
  const [transaction, setTransaction] = React.useState({
    destination: "",
    value: 0,
    data: "",
    parameter: "",
  });

  const [accounts, setAccounts] = accountContext;
  const [loading, setLoading] = React.useState(false);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [progress, setProgress] = React.useState(10);
  const [tooltip, setTooltip] = React.useState("");

  const columnsOwners: GridColDef[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "uuid", headerName: "UUID", width: 60, hide: true },
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
    {
      field: "action",
      headerName: "Action",
      width: 210,
      sortable: false,
      // align: "center",
      renderCell: (params) => {
        if (!accounts[0]) {
          setDataSelected("");
          setRowsOwners([]);
          setRowsTransactions([]);
          return;
        }
        if (
          rowsOwners
            .map((item) => item.address.toLowerCase())
            .includes(accounts[0].toLowerCase())
        ) {
          return (
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button onClick={() => handleReplaceOwner(params.row.address)}>
                Replace
              </Button>
              <Button
                color="secondary"
                onClick={() => handleRemoveOwner(params.row.address)}
              >
                Remove
              </Button>
            </ButtonGroup>
          );
        } else {
          return (
            <Button variant="text" aria-label="outlined" disabled>
              Readonly
            </Button>
          );
        }
      },
    },
  ];

  const columnsTransactions: GridColDef[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "uuid", headerName: "UUID", width: 60, hide: true },
    { field: "data", headerName: "Data", width: 60, hide: true },

    {
      field: "destination",
      headerName: "Destination",
      width: 250,
      // description: "This column has a value of address",
      flex: 1,
    },
    { field: "value", headerName: "Value", width: 150 },
    {
      field: "description",
      headerName: "Data / Subject",
      width: 150,
      align: "center",
    },
    {
      field: "confirmations",
      headerName: "Confirmations",
      width: 150,
      align: "center",
      renderCell: (params) => {
        const [signed, total] = params.row.confirmations;
        if (params.row.executed) {
          return (
            <>
              {signed.data.length} / {signed.data.length}&nbsp;&nbsp;
              <GppGoodIcon color="success" />
            </>
          );
        }
        // if (signed.data.length === total.length) {
        if (signed.data.length === require) {
          return (
            <>
              {/* {signed.data.length} / {total.length}&nbsp;&nbsp; */}
              {signed.data.length} / {require}&nbsp;&nbsp;
              <GppGoodIcon color="success" />
            </>
          );
        } else {
          return (
            <>
              {/* {signed.data.length} / {total.length}&nbsp;&nbsp;{" "} */}
              {signed.data.length} / {require}&nbsp;&nbsp;{" "}
              <GppMaybeIcon color="secondary" />
            </>
          );
        }
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 110,
      sortable: false,
      // align: "center",
      renderCell: (params) => {
        if (!accounts[0]) return;
        const [signed, total] = params.row.confirmations;
        // if (signed.data.length > total.length && !params.row.executed) {
        if (signed.data.length > require && !params.row.executed) {
          return (
            <Button variant="text" aria-label="outlined" disabled>
              Out Date
            </Button>
          );
        }
        if (
          total
            .map((item) => item.toLowerCase())
            .includes(accounts[0].toLowerCase())
        ) {
          if (params.row.executed) {
            return <></>;
          }
          if (
            !signed.data
              .map((item) => item.address.toLowerCase())
              .includes(accounts[0].toLowerCase())
          ) {
            return (
              <Button
                variant="outlined"
                aria-label="outlined"
                onClick={() =>
                  handleConfirmTransaction(
                    params.row.confirmations,
                    params.row.destination,
                    params.row.value,
                    params.row.data,
                    params.row.uuid
                  )
                }
              >
                Confirm
              </Button>
            );
          } else {
            let uuid;
            signed.data.forEach((item) => {
              if (item.address == accounts[0]) {
                uuid = item.id;
              }
            });
            return (
              <Button
                variant="outlined"
                color="secondary"
                aria-label="outlined"
                onClick={() => handleRevokeTransaction(uuid)}
              >
                Revoke
              </Button>
            );
          }
        } else {
          return (
            <Button variant="text" aria-label="outlined" disabled>
              Readonly
            </Button>
          );
        }
      },
    },
    {
      field: "executed",
      headerName: "Executed",
      width: 110,
      sortable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => {
        if (!accounts[0]) return;
        const [signed, total] = params.row.confirmations;
        // if (signed.data.length > total.length && !params.row.executed) {
        if (signed.data.length > require && !params.row.executed) {
          return (
            <Button variant="text" aria-label="outlined" disabled>
              No
            </Button>
          );
        }
        if (
          total
            .map((item) => item.toLowerCase())
            .includes(accounts[0].toLowerCase())
        ) {
          if (params.row.executed) {
            return (
              <Button variant="text" aria-label="text" disabled>
                Yes
              </Button>
            );
          } else {
            return (
              <Button
                variant="outlined"
                aria-label="outlined"
                // color="success"
                disabled={
                  // signed.data.length !== total.length ||
                  // !signed.data
                  //   .map((item) => item.address.toLowerCase())
                  //   .includes(accounts[0].toLowerCase())
                  signed.data.length != require ||
                  !rowsOwners
                    .map((item) => item.address.toLowerCase())
                    .includes(accounts[0].toLowerCase())
                }
                onClick={() =>
                  handleExecuteTransaction(
                    params.row.uuid,
                    params.row.destination,
                    params.row.value,
                    params.row.data,
                    signed.data
                  )
                }
              >
                Execute
              </Button>
            );
          }
        } else {
          return (
            <Button variant="text" aria-label="outlined" disabled>
              Readonly
            </Button>
          );
        }
      },
    },
  ];

  const handleSendTransaction = () => {
    setAction(SUBMIT_TRANSACTION);
    setOpenModal(true);
  };

  const handleSendTransactionStorage = async () => {
    let type = JSON.parse(transaction.data);
    let parameter = transaction.parameter.split(",").map((item) => item.trim());
    console.log(type, parameter);

    const encodeData = web3.eth.abi.encodeFunctionCall(type, parameter);

    const nonce = await web3.eth.getTransactionCount(dataSelected);

    await axios.post(`http://${window.location.hostname}:4000/transactions`, {
      id: uuidv4(),
      destination: transaction.destination,
      value: transaction.value,
      data: encodeData,
      description: action,
      nonce: nonce,
      address: dataSelected,
    });

    const owners = await initContract(dataSelected).methods.getOwners().call();

    const txn = await axios.get(
      `http://${window.location.hostname}:4000/transactions/${dataSelected}`
    );

    setRowsTransactions(
      await Promise.all(
        txn.data.map(async (item, index) => ({
          id: index,
          uuid: item.id,
          destination: item.destination,
          value: item.value,
          data: item.data,
          executed: item.mined,
          description: item.description,
          confirmations: [
            await axios.get(
              `http://${window.location.hostname}:4000/addresses/${item.id}`
            ),
            owners,
          ],
        }))
      )
    );
    setOpenModal(false);
  };

  const handleChangeThresholdStorage = async () => {
    console.log(newRequirement);
    const encodeData = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_threshold",
            type: "uint256",
          },
        ],
        name: "changeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [newRequirement]
    );

    const nonce = await web3.eth.getTransactionCount(dataSelected);

    await axios.post(`http://${window.location.hostname}:4000/transactions`, {
      id: uuidv4(),
      destination: dataSelected,
      value: 0,
      data: encodeData,
      description: action,
      nonce: nonce,
      address: dataSelected,
    });

    const owners = await initContract(dataSelected).methods.getOwners().call();

    const txn = await axios.get(
      `http://${window.location.hostname}:4000/transactions/${dataSelected}`
    );

    setRowsTransactions(
      await Promise.all(
        txn.data.map(async (item, index) => ({
          id: index,
          uuid: item.id,
          destination: item.destination,
          value: item.value,
          data: item.data,
          executed: item.mined,
          description: item.description,
          confirmations: [
            await axios.get(
              `http://${window.location.hostname}:4000/addresses/${item.id}`
            ),
            owners,
          ],
        }))
      )
    );
    setOpenModal(false);
  };

  const handleAddOwnerStorage = async () => {
    const encodeData = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_threshold",
            type: "uint256",
          },
        ],
        name: "addOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [newOwner, newRequirement]
    );
    const nonce = await web3.eth.getTransactionCount(dataSelected);

    await axios.post(`http://${window.location.hostname}:4000/transactions`, {
      id: uuidv4(),
      destination: dataSelected,
      value: 0,
      data: encodeData,
      description: action,
      nonce: nonce,
      address: dataSelected,
    });

    const owners = await initContract(dataSelected).methods.getOwners().call();

    const txn = await axios.get(
      `http://${window.location.hostname}:4000/transactions/${dataSelected}`
    );

    setRowsTransactions(
      await Promise.all(
        txn.data.map(async (item, index) => ({
          id: index,
          uuid: item.id,
          destination: item.destination,
          value: item.value,
          data: item.data,
          executed: item.mined,
          description: item.description,
          confirmations: [
            await axios.get(
              `http://${window.location.hostname}:4000/addresses/${item.id}`
            ),
            owners,
          ],
        }))
      )
    );
    setOpenModal(false);
  };

  const handleChangeThreshold = () => {
    setAction(CHANGE_THRESHOLD);
    setOpenModal(true);
  };

  const handleChangeRequirement = (event: SelectChangeEvent) => {
    setNewRequirement(event.target.value as string);
  };

  const handleAddOwner = () => {
    setAction(ADD_OWNER);
    setOpenModal(true);
  };

  const handleRevokeTransaction = async (uuid) => {
    await axios.delete(
      `http://${window.location.hostname}:4000/addresses/${uuid}`
    );

    const owners = await initContract(dataSelected).methods.getOwners().call();

    setRowsTransactions(
      await Promise.all(
        rowsTransactions.map(async (item, index) => ({
          id: item.id,
          uuid: item.uuid,
          destination: item.destination,
          value: item.value,
          data: item.data,
          executed: item.executed,
          description: item.description,
          confirmations: [
            await axios.get(
              `http://${window.location.hostname}:4000/addresses/${item.uuid}`
            ),
            owners,
          ],
        }))
      )
    );
  };

  const handleExecuteTransaction = (uuid, destination, value, data, signed) => {
    let signatures = signed.map((item, index) => item.signature);
    setLoading(true);
    console.log(destination, value, data, signatures);
    initContract(dataSelected)
      .methods.implementTransaction(destination, value, data, signatures)
      .send({ from: accounts[0] })
      .on("receipt", async (receipt) => {
        await axios.patch(
          `http://${window.location.hostname}:4000/transactions`,
          {
            id: uuid,
            mined: true,
          }
        );

        const owners = await initContract(dataSelected)
          .methods.getOwners()
          .call();

        const threshold = await initContract(dataSelected)
          .methods.threshold()
          .call();
        setRequire(threshold);

        console.log(owners);

        setRowsOwners(
          await Promise.all(
            owners.map(async (item, index) => {
              return {
                id: index,
                uuid: item,
                balance: web3.utils.fromWei(
                  await web3.eth.getBalance(item),
                  "ether"
                ),
                // message: item.substring(0, 30).concat("..."),
                address: item,
                transactionCount: await web3.eth.getTransactionCount(item),
                // isVerify: 0,
              };
            })
          )
        );

        const txn = await axios.get(
          `http://${window.location.hostname}:4000/transactions/${dataSelected}`
        );

        setRowsTransactions(
          await Promise.all(
            txn.data.map(async (item, index) => ({
              id: index,
              uuid: item.id,
              destination: item.destination,
              value: item.value,
              data: item.data,
              executed: item.mined,
              description: item.description,
              confirmations: [
                await axios.get(
                  `http://${window.location.hostname}:4000/addresses/${item.id}`
                ),
                owners,
              ],
            }))
          )
        );

        setLoading(false);
      })
      .on("error", () => {
        setLoading(false);
      });
  };

  const handleConfirmTransaction = async (
    confirmations,
    destination,
    value,
    data,
    uuid
  ) => {
    console.log(confirmations, destination, value, data);
    const chainId = await web3.eth.getChainId();
    const name = await initContract(dataSelected).methods.NAME().call();
    const version = await initContract(dataSelected).methods.VERSION().call();
    const msgParam = JSON.stringify({
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Transaction: [
          { name: "destination", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
      },
      domain: {
        name: name,
        version: version,
        chainId: chainId,
        verifyingContract: dataSelected,
      },
      primaryType: "Transaction",
      message: {
        destination: destination,
        value: value,
        data: data,
      },
    });

    const sign = await window.ethereum.request({
      method: "eth_signTypedData_v4",
      params: [accounts[0], msgParam],
    });

    await axios.post(
      `http://${window.location.hostname}:4000/addresses/transaction`,
      {
        id: uuidv4(),
        address: accounts[0],
        signature: sign,
        transactionId: uuid,
      }
    );

    const owners = await initContract(dataSelected).methods.getOwners().call();

    setRowsTransactions(
      await Promise.all(
        rowsTransactions.map(async (item, index) => ({
          id: item.id,
          uuid: item.uuid,
          destination: item.destination,
          value: item.value,
          data: item.data,
          executed: item.executed,
          description: item.description,
          confirmations: [
            await axios.get(
              `http://${window.location.hostname}:4000/addresses/${item.uuid}`
            ),
            owners,
          ],
        }))
      )
    );

    const addresses = await axios.get(
      `http://${window.location.hostname}:4000/addresses/${uuid}`
    );

    // if (addresses.data.length == owners.length) {
    if (addresses.data.length == require) {
      handleExecuteTransaction(uuid, destination, value, data, addresses.data);
    }
  };

  const handleReplaceOwnerStorage = async () => {
    const encodeData = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "replaceOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [oldOwner, newOwner]
    );
    const nonce = await web3.eth.getTransactionCount(dataSelected);

    await axios.post(`http://${window.location.hostname}:4000/transactions`, {
      id: uuidv4(),
      destination: dataSelected,
      value: 0,
      data: encodeData,
      description: action,
      nonce: nonce,
      address: dataSelected,
    });

    const owners = await initContract(dataSelected).methods.getOwners().call();

    const txn = await axios.get(
      `http://${window.location.hostname}:4000/transactions/${dataSelected}`
    );

    setRowsTransactions(
      await Promise.all(
        txn.data.map(async (item, index) => ({
          id: index,
          uuid: item.id,
          destination: item.destination,
          value: item.value,
          data: item.data,
          executed: item.mined,
          description: item.description,
          confirmations: [
            await axios.get(
              `http://${window.location.hostname}:4000/addresses/${item.id}`
            ),
            owners,
          ],
        }))
      )
    );
    setOpenModal(false);
  };

  const handleReplaceOwner = async (address: string) => {
    setOldOwner(address);
    setAction(REPLACE_OWNER);
    setOpenModal(true);
  };

  const handleRemoveOwnerStorage = async () => {
    const encodeData = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_threshold",
            type: "uint256",
          },
        ],
        name: "removeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [oldOwner, newRequirement]
    );
    const nonce = await web3.eth.getTransactionCount(dataSelected);

    await axios.post(`http://${window.location.hostname}:4000/transactions`, {
      id: uuidv4(),
      destination: dataSelected,
      value: 0,
      data: encodeData,
      description: action,
      nonce: nonce,
      address: dataSelected,
    });

    const owners = await initContract(dataSelected).methods.getOwners().call();

    const txn = await axios.get(
      `http://${window.location.hostname}:4000/transactions/${dataSelected}`
    );

    setRowsTransactions(
      await Promise.all(
        txn.data.map(async (item, index) => ({
          id: index,
          uuid: item.id,
          destination: item.destination,
          value: item.value,
          data: item.data,
          executed: item.mined,
          description: item.description,
          confirmations: [
            await axios.get(
              `http://${window.location.hostname}:4000/addresses/${item.id}`
            ),
            owners,
          ],
        }))
      )
    );
    setOpenModal(false);
  };

  const handleRemoveOwner = async (address: string) => {
    setOldOwner(address);
    setAction(REMOVE_OWNER);
    setOpenModal(true);
  };

  React.useEffect(() => {
    if (accounts.length < 0) {
      setDataSelect([]);
      return;
    }

    axios
      .get(`http://${window.location.hostname}:4000/wallets`)
      .then((response) => {
        setDataSelect(response.data.filter((item) => item.isIdentified));
      });
  }, [accounts]);

  const handleChangeWallet = async (
    event: SelectChangeEvent<typeof dataSelected>
  ) => {
    setLoadingTable(true);
    setDataSelected(event.target.value);

    const threshold = await initContract(event.target.value)
      .methods.threshold()
      .call();

    const owners = await initContract(event.target.value)
      .methods.getOwners()
      .call();

    setRequire(threshold);

    setTooltip(
      `Transaction requires the confirmation of ${threshold} out of ${owners.length} owners`
    );

    setRowsOwners(
      await Promise.all(
        owners.map(async (item, index) => {
          return {
            id: index,
            uuid: item,
            balance: web3.utils.fromWei(
              await web3.eth.getBalance(item),
              "ether"
            ),
            address: item,
            transactionCount: await web3.eth.getTransactionCount(item),
          };
        })
      )
    );

    const txn = await axios.get(
      `http://${window.location.hostname}:4000/transactions/${event.target.value}`
    );

    setRowsTransactions(
      await Promise.all(
        txn.data.map(async (item, index) => ({
          id: index,
          uuid: item.id,
          destination: item.destination,
          value: item.value,
          data: item.data,
          executed: item.mined,
          description: item.description,
          confirmations: [
            await axios.get(
              `http://${window.location.hostname}:4000/addresses/${item.id}`
            ),
            owners,
          ],
        }))
      )
    );

    setLoadingTable(false);
  };

  const handleCloseFormControl = () => {
    setOpenFormControl(false);
  };

  const handleOpenFormControl = () => {
    setOpenFormControl(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormControl sx={{ my: 1, width: 300 }}>
            <InputLabel id="demo-controlled-open-select-label">
              Identification
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={openFormControl}
              onClose={handleCloseFormControl}
              onOpen={handleOpenFormControl}
              value={dataSelected}
              label="Identification"
              onChange={handleChangeWallet}
            >
              {dataSelect.map((item, index) => {
                // let mergeId = item.id + "&" + item.combineId;
                return (
                  <MenuItem key={index} value={item.address}>
                    {item.title} | {item.createdAt.substring(0, 10)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {dataSelected.length > 0 && (
            <Tooltip title={tooltip}>
              <TextField
                sx={{ marginLeft: 0.5, width: 70 }}
                disabled
                id="outlined-disabled"
                // label="Disabled"
                value={`${require} / ${rowsOwners.length}`}
                defaultValue={`${require} / ${rowsOwners.length}`}
              />
            </Tooltip>
          )}

          {/* <Typography variant="h5">Hello</Typography> */}
          <Grow
            in={loading}
            style={{ transformOrigin: "0 0 0" }}
            {...(loading ? { timeout: 1000 } : {})}
          >
            <Stack sx={{ width: "20%", color: "grey.500" }} spacing={2}>
              <LinearProgress color="secondary" />
              <LinearProgress color="success" />
              <LinearProgress color="inherit" />
            </Stack>
          </Grow>
          <Zoom
            in={
              dataSelected.length > 0 &&
              rowsOwners
                .map((item) => item.address.toLowerCase())
                .includes(accounts[0])
            }
          >
            <ButtonGroup
              variant="outlined"
              sx={{ height: 55 }}
              aria-label="outlined primary button group"
            >
              <Button onClick={handleAddOwner}>Add Owner</Button>
              <Button onClick={handleChangeThreshold}>
                Change Requirement
              </Button>
              {/* <Button onClick={handleRemoveList}>Remove List</Button> */}
              <Button onClick={handleSendTransaction}>New Transaction</Button>
              {/* <Button color="secondary" onClick={handleRemove}>
                REMOVE
              </Button> */}
            </ButtonGroup>
          </Zoom>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ fontStyle: "italic" }}>Owners</Typography>
          {/* <Box sx={{ width: "90%" }}>
            {loadingTable && <LinearProgress value={progress} />}
          </Box> */}
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ height: 270, width: "100%" }}>
          <DataGrid
            rows={rowsOwners}
            columns={columnsOwners}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ fontStyle: "italic" }}>Transactions</Typography>
          <Box sx={{ width: "90%" }}>{loadingTable && <LinearProgress />}</Box>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ height: 370, width: "100%" }}>
          <DataGrid
            rows={rowsTransactions}
            columns={columnsTransactions}
            pageSize={7}
            rowsPerPageOptions={[7]}
            checkboxSelection
            // sortingMode="server"
          />
        </Box>
      </Grid>
      <Modal open={openModal} onClose={() => handleCloseModal()}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px #000",
            borderRadius: 1,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Stack>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {action}
            </Typography>
            <Divider />

            {action == REMOVE_OWNER && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    // justifyContent: "space-evenly",
                  }}
                >
                  <AccountCircle
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  />
                  {/* &nbsp;&nbsp; */}
                  <TextField
                    sx={{ width: "90%" }}
                    id="input-with-sx"
                    label="Address"
                    variant="standard"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={oldOwner}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <TripOriginIcon
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  />
                  <FormControl variant="standard" sx={{ width: 150 }}>
                    <InputLabel id="demo-simple-select-label">
                      Requirement
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={newRequirement}
                      label="Requirement"
                      onChange={handleChangeRequirement}
                    >
                      {rowsOwners.slice(1).map((item, index) => {
                        return (
                          <MenuItem value={index + 1}>{index + 1}</MenuItem>
                        );
                      })}
                      {/* <MenuItem value={10}>Ten</MenuItem>
                 <MenuItem value={20}>Twenty</MenuItem>
                 <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}

            {/* {action == ADD_OWNER && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <AccountCircle
                  sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                />
                <TextField
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNewOwner(event.target.value);
                    // console.log(event.target.value);
                  }}
                  sx={{ width: "90%" }}
                  id="input-with-sx"
                  label="Address"
                  variant="standard"
                />
              </Box>
            )} */}

            {action == ADD_OWNER && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <AccountCircle
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  />
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setNewOwner(event.target.value);
                      // console.log(event.target.value);
                    }}
                    sx={{ width: "90%" }}
                    id="input-with-sx"
                    label="Address"
                    variant="standard"
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <TripOriginIcon
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  />
                  <FormControl variant="standard" sx={{ width: 150 }}>
                    <InputLabel id="demo-simple-select-label">
                      Requirement
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={newRequirement}
                      label="Requirement"
                      onChange={handleChangeRequirement}
                    >
                      {rowsOwners.concat("NONE").map((item, index) => {
                        return (
                          <MenuItem value={index + 1}>{index + 1}</MenuItem>
                        );
                      })}
                      {/* <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}

            {action == CHANGE_THRESHOLD && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  // justifyContent: "space-around",
                }}
              >
                <TripOriginIcon
                  sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                />
                <FormControl variant="standard" sx={{ width: 150 }}>
                  <InputLabel id="demo-simple-select-label">
                    Requirement
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newRequirement}
                    label="Requirement"
                    onChange={handleChangeRequirement}
                  >
                    {rowsOwners.map((item, index) => {
                      return <MenuItem value={index + 1}>{index + 1}</MenuItem>;
                    })}
                    {/* <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
            )}

            {action == REPLACE_OWNER && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <AccountCircle
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  />
                  <TextField
                    sx={{ width: "90%" }}
                    id="input-with-sx"
                    label="Current Address"
                    variant="standard"
                    // disabled
                    InputProps={{
                      readOnly: true,
                    }}
                    value={oldOwner}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <AccountCircle
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  />
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setNewOwner(event.target.value)
                    }
                    sx={{ width: "90%" }}
                    id="input-with-sx"
                    label="New Address"
                    variant="standard"
                  />
                </Box>
              </>
            )}

            {action == SUBMIT_TRANSACTION && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <AccountCircle
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  />
                  <TextField
                    sx={{ width: "90%" }}
                    id="input-with-sx"
                    label="Destination"
                    variant="standard"
                    // disabled
                    // InputProps={{
                    //   readOnly: true,
                    // }}
                    // value={oldOwner}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      transaction.destination = event.target.value;
                      // setTransaction(
                      //   Object.entries(transaction).map((item, index) => {
                      //     item = event.target.value;
                      //   })
                      // );
                      setTransaction(transaction);
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  {/* <AccountCircle
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  /> */}
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      // setNewOwner(event.target.value)
                      {
                        transaction.value = Number(event.target.value);
                        setTransaction(transaction);
                      }
                    }
                    type="number"
                    sx={{ width: "100%" }}
                    id="input-with-sx"
                    label="Amount (ETH)"
                    // variant="standard"
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  {/* <AccountCircle
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  /> */}
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      // setNewOwner(event.target.value)
                      {
                        transaction.data = event.target.value;
                        setTransaction(transaction);
                      }
                    }
                    sx={{ width: "100%" }}
                    id="input-with-sx"
                    multiline
                    rows={4}
                    label="ABI String"
                    // variant="standard"
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  {/* <AccountCircle
                    sx={{ color: "action.active", mr: 1, mt: 1, fontSize: 60 }}
                  /> */}
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      // setNewOwner(event.target.value)
                      {
                        transaction.parameter = event.target.value;
                        setTransaction(transaction);
                      }
                    }
                    // type="number"
                    sx={{ width: "100%" }}
                    id="input-with-sx"
                    label="Parameter"
                    // variant="standard"
                  />
                </Box>
              </>
            )}

            <Stack
              sx={{ mt: 4, mb: 2, width: "100%" }}
              direction="row"
              spacing={0.5}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={() => {
                  if (action == REMOVE_OWNER) {
                    handleRemoveOwnerStorage();
                  } else if (action == ADD_OWNER) {
                    if (newOwner == "") {
                      console.log("Empty");
                    } else {
                      handleAddOwnerStorage();
                    }
                  } else if (action == REPLACE_OWNER) {
                    if (newOwner == "") {
                      console.log("Empty");
                    } else {
                      handleReplaceOwnerStorage();
                    }
                  } else if (action == SUBMIT_TRANSACTION) {
                    handleSendTransactionStorage();
                  } else if (action == CHANGE_THRESHOLD) {
                    handleChangeThresholdStorage();
                  }
                }}
              >
                Submit
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => handleCloseModal()}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
      {/* <Grid item xs={12}>
        <img
          src="Network-Effect-Banner.jpg"
          alt=""
          loading="lazy"
          height="500"
          width="100%"
        />
      </Grid> */}
    </Grid>
  );
}
