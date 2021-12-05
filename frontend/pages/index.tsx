import * as React from 'react';
import Head from 'next/head';
import MenuIcon from '@mui/icons-material/Menu';
import { Container, AppBar, Box, Toolbar, Typography, Button, Tabs, Tab, IconButton } from '@mui/material';

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

const web3 = new Web3("https://ropsten.infura.io/v3/0f47da3302904b19ad3f5d84b9719b1d" || Web3.givenProvider || "ws://localhost:8545");
const initContract = addr => new web3.eth.Contract(ChainIdentification.abi as AbiItem[], addr)

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <>
      {value === 0 && <Grid />}
      {value !== 0 && <p>Hello</p>}
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

  const { isLoadingContext, accountContext } = React.useContext(StoreContext);
  const [isLoading, setLoading] = isLoadingContext;
  const [accounts, setAccounts]: [any, any] = accountContext;


  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [value, setValue] = React.useState(0);
  const [isDisabled, setDisabled] = React.useState(false);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT + ": " + accounts[0]);
        // console.log(web3.eth.accounts.create())
        console.log(initContract(accounts[0]).methods.name.call({ from: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe" }));
        // console.log(initContract(accounts[0]).methods.name.send({ from: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe" }));
        // console.log(initContract(accounts[0]))

        // initContract(accounts[0]).methods.totalSupply().call()
        //   .then(function (result) {
        //     console.log(result)
        //   })

        // setDisabled(true);
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
      window.ethereum.on('accountChanged', handleNewAccounts);
      return () => {
        window.ethereum.removeListener('accountChanged', handleNewAccounts);
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
