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
import GridIndex from "../components/GridIndex";
import Manager from "../components/Manager";
import MetaMaskOnboarding from "@metamask/onboarding";
import Web3 from "web3";
import Link from "next/link";
import { LoadingButton } from "@mui/lab";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Statistic from "../components/Statistic";
import AddressBook from "../components/AddressBook";
// import Transactions from "../components/Transactions";
import MenuIcon from "@mui/icons-material/Menu";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PageviewIcon from "@mui/icons-material/Pageview";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IosShareIcon from "@mui/icons-material/IosShare";
import Tooltip from "@mui/material/Tooltip";
import { abiFactory } from "../contracts/Factory";
import { StoreContext } from "../store";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useRouter } from "next/router";

import {
  ONBOARD_TEXT,
  CONNECT_TEXT,
  CONNECTED_TEXT,
  NOT_CONNECT_TEXT,
  DISCONNECT,
} from "../utils/constant";
import { addStorage } from "../utils/localStorage";

// const ONBOARD_TEXT: string = "Install MetaMask!";
// const CONNECT_TEXT: string = "Connect Wallet";
// const CONNECTED_TEXT: string = "Connected";
// const NOT_CONNECT_TEXT: string = "Not Connected";
// const DISCONNECT: string = "Disconnect";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px #000",
  borderRadius: 1,
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
      {value === 0 && <GridIndex />}
      {value === 1 && <Manager />}
      {value === 2 && <AddressBook />}
      {value === 3 && <Statistic />}
    </>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// const messageVerify = "0x" + randomBytes(32).toString("hex");
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abiFactory as any[], addr);

export default function Index() {
  const router = useRouter();
  const { accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [accounts, setAccounts]: [Array<string>, any] = accountContext;
  const [address, setAddress]: [
    Array<{
      account: string;
      status: boolean;
    }>,
    any
  ] = addressContext;
  const [signature, setSignature] = signatureContext;
  // const [message, setMessage] = messageContext;
  const [buttonText, setButtonText] = React.useState(NOT_CONNECT_TEXT);
  const [buttonTextAddress, setButtonTextAddress] =
    React.useState(ONBOARD_TEXT);
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [networkType, setNetworkType] = React.useState("");

  // web3.eth.net.getId().then(console.log);
  // web3.eth.getChainId().then(console.log);
  // web3.eth.getNodeInfo().then(console.log);

  const onboarding = React.useRef<MetaMaskOnboarding>();
  const [openModal, setOpenModal] = React.useState(false);
  const [copyText, setCopyText] = React.useState("Copy");

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    async function setData(account: string) {
      // setAddress(address.add(account));
      // setAddress(
      //   address.add("0x" + chainId.slice(2).padStart(2, "0") + account.slice(2))
      // );

      const domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ];

      const transaction = [
        { name: "destination", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
      ];

      const authority = [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ];

      const msgParam = JSON.stringify({
        types: {
          EIP712Domain: domain,
          Transaction: transaction,
        },
        domain: {
          name: "EIP712",
          version: "1.0.1",
          chainId: "3",
          verifyingContract: "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53",
        },
        primaryType: "Transaction",
        message: {
          destination: "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53",
          value: 0,
          data: "0x0338f63a0000000000000000000000003aa528b07d997b2e78e7bfb96fdfb7ca31ce0e4600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000041f93c3cf37405bc8b8617fd685a3cc1c2fe62e9847f58aa19cc10616b5180fc55003481a6218e3728e8073c6ebcc50016e95ad2c7bf6f30240a5a4369b96c24e91b00000000000000000000000000000000000000000000000000000000000000",
        },
      });

      // window.ethereum
      //   .request({
      //     method: "eth_signTypedData_v4",
      //     params: [account, msgParam],
      //   })
      //   .then((result) => console.log(result));

      // if (address.every((element: string) => element != account)) {
      //   setAddress([...address, account]);
      // }

      window.ethereum
        .request({
          method: "personal_sign",
          params: ["Authorize", account],
        })
        .then((sign) => setSignature(signature.add(sign)));

      // setAddress(
      //   address.add("0x" + chainId.slice(2).padStart(2, "0") + account.slice(2))
      // );
      // setAddress(address.add(account));
      // setSignature(signature.add(sign));
    }
    // setMessage(messageVerify);
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        addStorage(
          {
            address: accounts[0],
            type: "Externally Owned Accounts",
          },
          "addressBook"
        );
        if (address.every((element) => element.account != accounts[0])) {
          setAddress([
            ...address,
            {
              account: accounts[0],
              status: 0,
              index: address.length,
            },
          ]);
        }
        // setData(accounts[0]);
        web3.eth
          .getBalance(accounts[0])
          .then((item: any) => setBalance(item / 10 ** 18));
        web3.eth.net
          .getNetworkType()
          .then((item) =>
            setNetworkType(item.charAt(0).toUpperCase() + item.slice(1))
          );
        setButtonText(CONNECTED_TEXT);
        setButtonTextAddress(accounts[0].substring(0, 10).concat("..."));
        // setAddress([...address, accounts[0]]);
        // setData(accounts[0], chainId);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(NOT_CONNECT_TEXT);
        setButtonTextAddress(CONNECT_TEXT);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(setAccounts);
      window.ethereum.on("accountsChanged", (accounts: string[]) =>
        setAccounts(accounts)
      );
      window.ethereum.on("chainChanged", (chainId: string) => {
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
          // setChainId(chainId);
          window.location.reload();
        });
        setTimeout(() => {
          window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((newAccounts: string[]) => setAccounts(newAccounts));
          // window.ethereum
          //   .request({ method: "eth_chainId" })
          //   .then((newChainId: string) => setChainId(newChainId));
          setLoading(false);
        }, 500);
      } else {
        setOpenModal(true);
      }
    } else {
      onboarding.current.startOnboarding();
    }
  }

  function onDisconnect(event: React.SyntheticEvent) {
    setOpenModal(false);
    setLoading(true);
    setTimeout(() => {
      setButtonText(CONNECT_TEXT);
      setAccounts([]);
      // setAddress(new Set());
      // setSignature(new Set());
      setAddress([]);
      setSignature([]);
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

  // const handleMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setMessage(event.target.value);
  // };

  return (
    <>
      <Head>
        <title>Identification</title>
      </Head>
      <Container maxWidth="lg">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {
                // window.location.href = `http://${window.location.hostname}:3000`;
                router.push(`/`);
              }}
            >
              <SentimentSatisfiedAltIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Balance: {balance.toPrecision(5)} ETH
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 8 }}>
              {networkType}
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
        <Box sx={{ borderBottom: 1, borderColor: "divider", my: 2 }}>
          {/* <TextField
            id="outlined-basic"
            label="Message"
            variant="outlined"
            sx={{ mt: 5, width: "78ch" }}
            defaultValue={messageVerify}
            onChange={handleMessage}
            inputProps={{ maxLength: 66 }}
          /> */}
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="secondary"
          >
            <Tab label="identification" {...a11yProps(0)} />
            <Tab label="asset manager" {...a11yProps(1)} />
            <Tab label="address book" {...a11yProps(2)} />
            <Tab label="statistic" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0} />
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={style}>
            <Stack>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Wallet Connection
              </Typography>
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
                  <a
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography>View on Etherscan</Typography>&nbsp;
                    <OpenInNewIcon sx={{ fontSize: 18 }} />
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
