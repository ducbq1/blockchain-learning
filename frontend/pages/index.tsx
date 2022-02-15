import * as React from "react";
import Head from "next/head";
import {
  Container,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Stack,
  Modal,
  IconButton,
  Divider,
} from "@mui/material";
import { randomBytes } from "crypto";
import Grid from "../components/Grid";
import Card from "../components/Card";
import DataIdentify from "../components/DataIdentify";
import MetaMaskOnboarding from "@metamask/onboarding";
import { StoreContext } from "../store";
import Web3 from "web3";
import Link from "next/link";

import { LoadingButton } from "@mui/lab";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Statistic from "../components/Statistic";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PageviewIcon from "@mui/icons-material/Pageview";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IosShareIcon from "@mui/icons-material/IosShare";
import Tooltip from "@mui/material/Tooltip";

const ONBOARD_TEXT: string = "Install MetaMask!";
const CONNECT_TEXT: string = "Connect Wallet";
const CONNECTED_TEXT: string = "Connected";
const NOT_CONNECT_TEXT: string = "Not Connected";
const DISCONNECT: string = "Disconnect";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

// const initContract = (addr: string) => new web3.eth.Contract(ChainIdentification.abi as any[], addr)
// const myContract = initContract("0xe7292a0ce6cb4bc958d4d1311dd5aae872156265");
// const newSocket = io(`http://${window.location.hostname}:4000/notifications`);

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <>
      {value === 0 && <Grid />}
      {value === 1 && <DataIdentify />}
      {value === 2 && <Statistic />}
    </>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const messageVerify = "0x" + randomBytes(32).toString("hex");
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

export default function Index() {
  const { messageContext, accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [accounts, setAccounts]: [Array<string>, any] = accountContext;
  const [address, setAddress] = addressContext;
  const [signature, setSignature] = signatureContext;
  const [message, setMessage] = messageContext;
  const [buttonText, setButtonText] = React.useState(NOT_CONNECT_TEXT);
  const [buttonTextAddress, setButtonTextAddress] =
    React.useState(ONBOARD_TEXT);
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [chainId, setChainId] = React.useState("");
  const onboarding = React.useRef<MetaMaskOnboarding>();
  const [open, setOpen] = React.useState(false);
  const [copyText, setCopyText] = React.useState("Copy");

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    async function checkBlocks(start, end) {
      for (let i = start; i < end; i++) {
        let block = await web3.eth.getBlock(i);
        console.log(`[*] Searching block ${i}`);
        if (block && block.transactions) {
          for (let txHash of block.transactions) {
            let tx = await web3.eth.getTransaction(txHash);
            if (
              tx.to !== null &&
              accounts[0].toLowerCase() === tx.to.toLowerCase()
            ) {
              console.log(`[*] Transaction found on block ${i}`);
              console.log({
                address: tx.from,
                value: web3.utils.fromWei(tx.value, "ether"),
                timestamp: new Date(),
              });
            }
          }
        }
      }
    }

    web3.eth.getBlock("latest").then((element) => {
      checkBlocks(0, 3);
    });

    async function handleSet(
      message: string,
      chainId: string,
      account: string
    ) {
      setAddress(
        address.add("0x" + chainId.slice(2).padStart(2, "0") + account.slice(2))
      );
      const sign = await web3.eth.sign(message, account);
      setSignature(signature.add(sign));
    }
    setMessage(messageVerify);
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setButtonTextAddress(accounts[0].substring(0, 10).concat("..."));
        handleSet(message, chainId, accounts[0]);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(NOT_CONNECT_TEXT);
        setButtonTextAddress(CONNECT_TEXT);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    async function handleAccounts() {
      const newAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const newChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(newChainId);
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      handleAccounts();
      window.ethereum.on("accountsChanged", (accounts: string[]) =>
        setAccounts(accounts)
      );
      window.ethereum.on("chainChanged", (chainId: string) => {
        setChainId(chainId);
        window.location.reload();
      });
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          (accounts: string[]) => setAccounts(accounts)
        );
      };
    }
  }, []);

  function onConnect(event: React.SyntheticEvent) {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length == 0) {
        setLoading(true);
        window.ethereum.on("accountsChanged", (accounts: string[]) =>
          setAccounts(accounts)
        );
        window.ethereum.on("chainChanged", (chainId: string) => {
          setChainId(chainId);
          window.location.reload();
        });
        setTimeout(() => {
          window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((newAccounts: string[]) => setAccounts(newAccounts));
          window.ethereum
            .request({ method: "eth_chainId" })
            .then((newChainId: string) => setChainId(newChainId));
          setLoading(false);
        }, 500);
      } else {
        handleOpen();
      }
    } else {
      onboarding.current.startOnboarding();
    }
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function onDisconnect(event: React.SyntheticEvent) {
    setOpen(false);
    setLoading(true);
    setTimeout(() => {
      setButtonText(CONNECT_TEXT);
      setAccounts([]);
      setAddress(new Set());
      setSignature(new Set());
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
      setLoading(false);
    }, 500);
    /*
    window.ethereum.request({
      method: "eth_requestAccounts",
      params: [{eth_accounts: {}}]
    });
    window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    })
    */
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Identification</title>
      </Head>
      <Container maxWidth="lg">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cross Chain Identification
            </Typography>
            {/* <LoadingButton
              color="inherit"
              onClick={onDisconnect}
              startIcon={<ExitToAppIcon />}
              loading={loading}
              loadingPosition="start"
            >
              Disconnect
            </LoadingButton> */}
            <LoadingButton
              color="inherit"
              onClick={onConnect}
              startIcon={<AccountBalanceWalletIcon />}
              loading={loading}
              loadingPosition="start"
            >
              <Stack alignItems="flex-start">
                <Typography variant="caption">
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} /> {buttonText}
                </Typography>
                <Typography variant="button">{buttonTextAddress}</Typography>
              </Stack>
            </LoadingButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <TextField
            id="outlined-basic"
            label="Message"
            variant="outlined"
            sx={{ mt: 5, width: "78ch" }}
            defaultValue={messageVerify}
            onChange={handleMessage}
            inputProps={{ maxLength: 66 }}
          />
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="secondary"
          >
            <Tab label="identification" {...a11yProps(0)} />
            <Tab label="asset manager" {...a11yProps(1)} />
            <Tab label="statistic" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0} />
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Stack>
              <Typography variant="h5">Wallet Connection</Typography>
              <Divider />
              <Stack
                sx={{ my: 2 }}
                direction="row"
                spacing={0}
                alignItems="center"
              >
                <Typography variant="h6" component="h2">
                  {accounts[0]}
                </Typography>
                <Tooltip title={copyText} placement="top">
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(accounts[0]);
                      setCopyText("Copied");
                      setTimeout(() => {
                        setCopyText("Copy");
                      }, 1000);
                    }}
                    size="medium"
                    // color="primary"
                    component="span"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Link
                  href={`https://ropsten.etherscan.io/address/${accounts[0]}`}
                >
                  <a target="_blank">
                    <Typography>
                      View on Etherscan <IosShareIcon />
                    </Typography>
                  </a>
                </Link>
                <Button
                  sx={{ height: 35 }}
                  variant="outlined"
                  onClick={onDisconnect}
                >
                  {DISCONNECT}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      </Container>
    </>
  );
}
