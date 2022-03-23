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
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  ButtonGroup,
  Divider,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abiOwnerManager as any[], addr);

export default function Manager() {
  const REMOVE_OWNER = "Remove Owner";
  const ADD_OWNER = "Add Owner";
  const REPLACE_OWNER = "Replace Owner";
  const SUBMIT_TRANSACTION = "Submit Transaction";

  const myContract = initContract(factoryAddress);
  const { accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [signature, setSignature] = signatureContext;

  const [age, setAge] = React.useState<string | number>("");
  const [dataSelect, setDataSelect] = React.useState([]);
  const [dataSelected, setDataSelected] = React.useState<string>("");
  const [rowsOwners, setRowsOwners] = React.useState([]);
  const [rowsTransactions, setRowsTransactions] = React.useState([]);
  const [openFormControl, setOpenFormControl] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [action, setAction] = React.useState("");

  const [oldOwner, setOldOwner] = React.useState("");
  const [newOwner, setNewOwner] = React.useState("");
  const [transaction, setTransaction] = React.useState({});

  const [accounts, setAccounts] = accountContext;
  const [loading, setLoading] = React.useState(false);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [progress, setProgress] = React.useState(10);

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

  const columnsOwners: GridColDef[] = [
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
            <Button variant="outlined" aria-label="outlined" disabled>
              Readonly
            </Button>
          );
        }

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

  const columnsTransactions: GridColDef[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "uuid", headerName: "UUID", width: 60, hide: true },
    // {
    //   field: "message",
    //   headerName: "Message",
    //   width: 200,
    //   sortable: false,
    //   flex: 1,
    // },
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
        if (signed.data.length === total.length) {
          return (
            <>
              {signed.data.length} / {total.length}&nbsp;&nbsp;
              <GppGoodIcon color="success" />
            </>
          );
        } else {
          return (
            <>
              {signed.data.length} / {total.length}&nbsp;&nbsp;{" "}
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
        const [signed, total] = params.row.confirmations;
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
            <Button variant="outlined" aria-label="outlined" disabled>
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
        const [signed, total] = params.row.confirmations;
        if (
          total
            .map((item) => item.toLowerCase())
            .includes(accounts[0].toLowerCase())
        ) {
          if (params.row.executed) {
            return "Yes";
          } else {
            return (
              <Button
                variant="outlined"
                aria-label="outlined"
                // color="success"
                disabled={
                  signed.data.length !== total.length ||
                  !signed.data
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
            <Button variant="outlined" aria-label="outlined" disabled>
              Readonly
            </Button>
          );
        }
      },
    },
  ];

  const handleRemoveList = () => {};

  const handleAddOwnerStorage = async () => {
    const encodeData = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "addOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [newOwner]
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

  const handleAddOwner = () => {
    setAction(ADD_OWNER);
    setOpenModal(true);
  };

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
            setRowsOwners(
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

    await axios.post(`http://${window.location.hostname}:4000/addresses`, {
      id: uuidv4(),
      address: accounts[0],
      signature: sign,
      transactionId: uuid,
    });

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
        ],
        name: "removeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [oldOwner]
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
    // const encodeData = web3.eth.abi.encodeFunctionCall(
    //   {
    //     inputs: [
    //       {
    //         internalType: "address",
    //         name: "owner",
    //         type: "address",
    //       },
    //     ],
    //     name: "removeOwner",
    //     outputs: [],
    //     stateMutability: "nonpayable",
    //     type: "function",
    //   },
    //   [address]
    // );
    // const nonce = await web3.eth.getTransactionCount(dataSelected);

    // await axios.post(`http://${window.location.hostname}:4000/transactions`, {
    //   id: uuidv4(),
    //   destination: dataSelected,
    //   value: 0,
    //   data: encodeData,
    //   description: "Remove Owners",
    //   nonce: nonce,
    //   address: dataSelected,
    // });

    // const owners = await initContract(dataSelected).methods.getOwners().call();

    // const txn = await axios.get(
    //   `http://${window.location.hostname}:4000/transactions/${dataSelected}`
    // );

    // setRowsTransactions(
    //   await Promise.all(
    //     txn.data.map(async (item, index) => ({
    //       id: index,
    //       uuid: item.id,
    //       destination: item.destination,
    //       value: item.value,
    //       data: item.data,
    //       executed: item.mined,
    //       description: item.description,
    //       confirmations: [
    //         await axios.get(
    //           `http://${window.location.hostname}:4000/addresses/${item.id}`
    //         ),
    //         owners,
    //       ],
    //     }))
    //   )
    // );
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
            setRowsOwners(
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
      setRowsOwners([]);
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

    axios
      .get(`http://${window.location.hostname}:4000/wallets`)
      .then((response) => {
        setDataSelect(response.data);
      });
  }, [accounts]);

  const handleChangeWallet = async (
    event: SelectChangeEvent<typeof dataSelected>
  ) => {
    // let catchValue = event.target.value;
    // console.log(event.target.value);
    setLoadingTable(true);
    setDataSelected(event.target.value);

    // initContract(event.target.value)
    //   .methods.getOwners()
    //   .call()
    //   .then(async (result) => {
    //     setRowsOwners(
    //       await Promise.all(
    //         result.map(async (item, index) => {
    //           return {
    //             id: index,
    //             uuid: item,
    //             balance: web3.utils.fromWei(
    //               await web3.eth.getBalance(item),
    //               "ether"
    //             ),
    //             message: item.substring(0, 30).concat("..."),
    //             address: item,
    //             transactionCount: await web3.eth.getTransactionCount(item),
    //             isVerify: 0,
    //           };
    //         })
    //       )
    //     );
    //   });

    const owners = await initContract(event.target.value)
      .methods.getOwners()
      .call();

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
          <Grow
            in={loading}
            style={{ transformOrigin: "0 0 0" }}
            {...(loading ? { timeout: 1000 } : {})}
          >
            <Stack sx={{ width: "50%", color: "grey.500" }} spacing={2}>
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
              <Button onClick={handleRemoveList}>Remove List</Button>
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
        <Box sx={{ height: 370, width: "100%" }}>
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
            )}

            {action == ADD_OWNER && (
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
                  label="Address"
                  variant="standard"
                />
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
                      console.log("Hello");
                    } else {
                      handleAddOwnerStorage();
                    }
                  } else if (action == REPLACE_OWNER) {
                    handleReplaceOwnerStorage();
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
