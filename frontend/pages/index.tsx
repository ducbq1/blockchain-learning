import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Container, AppBar, Box, Toolbar, Typography, Button, Tabs, Tab, IconButton } from '@mui/material';


import Grid from "../components/Grid";
import MetaMaskOnboarding from '@metamask/onboarding'

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


export default function ButtonAppBar() {

  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [value, setValue] = React.useState(0);
  const [isDisabled, setDisabled] = React.useState(false);
  const onboarding = React.useRef<MetaMaskOnboarding>();
  const [accounts, setAccounts] = React.useState([]);

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
        console.log(accounts)
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
        window.ethereum.off('accountChanged', handleNewAccounts);
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
        .then((newAccounts) => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  }

  return (
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
  );
}
