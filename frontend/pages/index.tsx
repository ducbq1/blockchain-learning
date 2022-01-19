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
} from "@mui/material";
import { randomBytes } from "crypto";
import Grid from "../components/Grid";
import Card from "../components/Card";
import DataIdentify from "../components/DataIdentify";
import MetaMaskOnboarding from "@metamask/onboarding";
import { StoreContext } from "../store";
import Web3 from "web3";
import { LoadingButton } from "@mui/lab";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const ONBOARD_TEXT: string = "Install MetaMask!";
const CONNECT_TEXT: string = "Connect";
const CONNECTED_TEXT: string = "Connected";

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
      {value === 2 && <p>STATISTIC...</p>}
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
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [chainId, setChainId] = React.useState("");
  const onboarding = React.useRef<MetaMaskOnboarding>();

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
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
        setButtonText(CONNECTED_TEXT + ": " + accounts[0]);
        handleSet(message, chainId, accounts[0]);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
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
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: string[]) => setAccounts(newAccounts));
      window.ethereum
        .request({ method: "eth_chainId" })
        .then((newChainId: string) => setChainId(newChainId));
      window.ethereum.on("accountsChanged", (accounts: string[]) =>
        setAccounts(accounts)
      );
      window.ethereum.on("chainChanged", (chainId: string) => {
        setChainId(chainId);
        window.location.reload();
      });
    } else {
      onboarding.current.startOnboarding();
    }
  }

  function onDisconnect(event: React.SyntheticEvent) {
    console.log("Try to disconnect...");
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
            <LoadingButton
              color="inherit"
              onClick={onDisconnect}
              startIcon={<ExitToAppIcon />}
              loading={loading}
              loadingPosition="start"
            >
              Disconnect
            </LoadingButton>
            <Button color="inherit" onClick={onConnect}>
              {buttonText}
            </Button>
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
      </Container>
    </>
  );
}
