import * as React from 'react';
import Head from 'next/head';
import MenuIcon from '@mui/icons-material/Menu';
import { Container, AppBar, Box, Toolbar, Typography, Button, Tabs, Tab, IconButton } from '@mui/material';
import { randomBytes } from 'crypto';

// did:ethr:rinkeby:0x6acf3bb1ef0ee84559de2bc2bd9d91532062a730

import Grid from "../components/Grid";
import MetaMaskOnboarding from '@metamask/onboarding'
import MyStore, { StoreContext } from '../store';


import Web3 from 'web3'
import ChainIdentification from '../contracts/ChainIdentification'
import { IntegrationInstructionsTwoTone } from '@mui/icons-material';

const ONBOARD_TEXT: string = 'Install MetaMask!';
const CONNECT_TEXT: string = 'Connect';
const CONNECTED_TEXT: string = 'Connected';

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

type AbiItem = any;

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = addr => new web3.eth.Contract(ChainIdentification.abi as AbiItem[], addr)
const messageVerify = "0x" + randomBytes(32).toString('hex');
console.log(messageVerify)

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <>
      {value === 0 && <Grid msgVerify={messageVerify} />}
      {value === 1 && <p>Hello</p>}
      {value === 2 && <p>Goodbye</p>}
    </>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export default function Index() {

  const { isLoadingContext, accountContext, addressContext, signatureContext } = React.useContext(StoreContext);
  const [isLoading, setLoading] = isLoadingContext;
  const [accounts, setAccounts]: [any, any] = accountContext;
  const [address, setAddress] = addressContext;
  const [signature, setSignature] = signatureContext;

  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [value, setValue] = React.useState(0);
  const [isDisabled, setDisabled] = React.useState(false);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  const myContract = initContract("0x93ab30ff2cf17885d94f0f4065997cf1336714ef");
  // console.log(myContract.methods.name().call().then((result) => console.log(result)))
  // myContract.methods.verify(
  //   "0xedfbb352a9180afeb44a5dc89c55cbcd4053b731188df9abb0e75a003cfae6d4",
  //   "0x60a6d9b077878ba9d439469c83bb2fa9ae7421025c9eeeef43585fea4ce7a13965202160eadcfb651d1d95f8c10fec7cfe1ad4275131577b27a08bce7503c46f00",
  //   "0x8B6ff17E6a61879661296CBA916BeC85F6649062"
  // ).call().then(result => console.log(result));

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    async function handleSet(messageVerify, account) {
      setAddress(address.add(account));
      const sign = await web3.eth.sign(messageVerify, account);
      setSignature(signature.add(sign));
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT + ": " + accounts[0]);
        handleSet(messageVerify, accounts[0]);
        setDisabled(true);
        console.log(address, signature);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleNewAccounts);
      window.ethereum.on('accountsChanged', handleNewAccounts);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleNewAccounts);
      }
    }
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }

  function onConnect(event: React.SyntheticEvent) {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => setAccounts(newAccounts))
    } else {
      onboarding.current.startOnboarding();
    }
  }

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
            <Button color="inherit" onClick={onConnect} disabled={isDisabled}>{buttonText}</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor="secondary">
            <Tab label="Identification" {...a11yProps(0)} />
            <Tab label="Wallet Manager" {...a11yProps(1)} />
            <Tab label="Statistic" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0} />
      </Container>
    </>

  );
}
