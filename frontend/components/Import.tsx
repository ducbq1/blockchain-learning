import * as React from 'react';
import Stack from "@mui/material/Stack";
import Fab from '@mui/material/Fab';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Snackbar from '@mui/material/Snackbar';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import { StoreContext } from '../store';
import Web3 from 'web3'
import { abi } from '../contracts/ChainIdentification'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import PublishIcon from '@mui/icons-material/Publish';
import NavigationIcon from '@mui/icons-material/Navigation';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';



const mapping = {
    "0x01": "Mainnet",
    "0x03": "Ropsten",
    "0x04": "Rinkeby",
    "0x05": "Goerli",
    "0x2a": "Kovan",
    "0x38": "BSC"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) => new web3.eth.Contract(abi as any[], addr)

export default function Import(props: {
    item: {
        name: string,
        address: string,
        active: boolean,
    }[]
}) {

    const myContract = initContract("0x332917dAE7acB7Ef7755CF3dD3802De26fFa6705");
    // const myContract = initContract("0x7831a9F1e393094a32af5C7b3A9b47abf65D6633");


    const { messageContext, accountContext, addressContext, signatureContext } = React.useContext(StoreContext);
    const [accounts, setAccounts] = accountContext;
    const [address, setAddress] = addressContext;
    const [signature, setSignature] = signatureContext;
    const [isVerify, setIsVerify] = React.useState(false);
    const [message, setMessage] = messageContext;
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const handleVerify = async () => {
        setLoading(true);

        const data_addr = [];
        address.forEach((item: string) => {
            data_addr.push(item);
        });
        const data_sign = [];
        signature.forEach((item: any) => {
            data_sign.push(item);
        })

        if (data_addr.length > data_sign.length) {
            setIsVerify(false);
            setOpen(true);
            return;
        }

        const result = await myContract.methods.verifyPayload(
            Date.now(),
            data_addr,
            data_sign,
            message
        ).call();

        setIsVerify(result);
        setLoading(false);
        setOpen(true);
    }

    const handleTransaction = async () => {

        setLoading(true);

        const data_addr = [];
        address.forEach((item: string) => {
            data_addr.push(item);
        });
        const data_sign = [];
        signature.forEach((item: any) => {
            data_sign.push(item);
        })

        if (data_addr.length > data_sign.length) {
            setIsVerify(false);
            setOpen(true);
            return;
        }

        myContract.methods.name().call().then((result: any) => console.log(result))
        myContract.methods.getRecoveredAddress(
            "0x0739da1c678dfbd9fe7452382082567c18c7f448e2702a7177b3223415d145ab57fa11471dc7d8cf1d31c6c7b7f1fb6b02b471565392d5cb9dd2df0ade989cc41b",
            "0xd6601225b99170f73c5678fa7fe4924d3737836e458c690d4dcc93a84901b2c2"
        ).call().then((result: any) => console.log(result))
        

        const resultValue = await myContract.methods.verifyPayload(
            Date.now(),
            data_addr,
            data_sign,
            message
        ).send({from: accounts[0]});
        const resultId = resultValue.events.TransactionComplete.returnValues.random;
        console.log(resultId);
        const result: boolean  = resultId > 0;

        setIsVerify(result);
        setLoading(false);
        setOpen(true);

        if (result) {
            setIsVerify(result);
            const identifyId: string = uuidv4();
            const sumBalance = await myContract.methods.sumBalance(resultId).call();
            await axios.post(`http://${window.location.hostname}:4000/identifies`, {
                title: "Identify",
                message: message,
                combineId: resultId,
                balance: sumBalance,
                id: identifyId
            });
            
            let setOfAddresses = address.values();
            let setOfSignature = signature.values();
            for (let i = 0; i < address.size; i++) {
                axios.post(`http://${window.location.hostname}:4000/addresses`, {
                    id: uuidv4(),
                    message: message,
                    address: setOfAddresses.next().value,
                    signature: setOfSignature.next().value,
                    isVerify: true,
                    identifyId: identifyId
                })
            }
        }
    }


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <Stack direction="row" spacing={3} justifyContent={"flex-start"}>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }} sx={{color: '#673ab7'}}>NETWORK</Typography>
                    {props.item.map((it, index) => <Typography key={index} variant="body1" my={0.5} style={{ fontWeight: 600 }}>{mapping[it.name]}</Typography>)}
                </Stack>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }} sx={{color: '#673ab7'}}>ADDRESS</Typography>
                    {props.item.map((it, index) => <Typography key={index} variant="body1" my={0.5} style={{ fontWeight: 600 }}>{"0x" + it.address.substring(0)}</Typography>)}
                </Stack>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }} sx={{color: '#673ab7'}}>ACTIVE</Typography>
                    {props.item.map((it, index) => <IconButton key={index} size="small" color="primary" component="span"><GppMaybeIcon /></IconButton>)}
                </Stack>
            </Stack>
            <Divider />
            <Box sx={{ '& > :not(style)': { m: 1 } }}>

                <Button variant="contained" startIcon={<DoneAllIcon />} onClick={handleVerify}>Verify all account</Button>
                <LoadingButton
                    onClick={handleTransaction}
                    startIcon={<PublishIcon />}
                    loading={loading}
                    loadingPosition="start"
                    variant="contained"
                    color="secondary"
                >
                    Send
                </LoadingButton>
            </Box>

            {isVerify && <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Verify success!
                    </Alert>
                </Snackbar>
            }
            {!isVerify && <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Verify failed!
                    </Alert>
                </Snackbar>
            }

        </>
    );
}