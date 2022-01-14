import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import EditIcon from "@mui/icons-material/Edit";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, Typography, Modal, TextField, MenuItem } from '@mui/material';
import BasicModal from "./BasicModal"
import { StoreContext } from '../store';

import Web3 from 'web3'
import ChainIdentification from '../contracts/ChainIdentification'
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type AbiItem = any;


const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = addr => new web3.eth.Contract(ChainIdentification.abi as AbiItem[], addr)

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const currencies = [
    {
        value: 'Binance',
        label: 'BSC',
    },
    {
        value: 'Ethereum',
        label: 'ETH',
    },
    {
        value: 'Rinkeby',
        label: 'ETH',
    },
    {
        value: 'Goerli',
        label: 'ETH',
    },
];


export default function Import(props: {
    msgVerify: string,
    network: string,
    item: {
        name: string,
        address: string,
    }[]
}) {

    const myContract = initContract("0xa05c55ddd722477ee52be006309580653faebf37");

    const { isLoadingContext, accountContext, addressContext, signatureContext } = React.useContext(StoreContext);
    const [accounts, setAccounts] = accountContext;
    const [address, setAddress] = addressContext;
    const [signature, setSignature] = signatureContext;
    const [currency, setCurrency] = React.useState('EUR');
    const [isVerify, setIsVerify] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);

    const handleVerify = async () => {
        const data_addr = [];
        address.forEach(item => {
            data_addr.push("0x01" + item.slice(2));
        });
        const data_sign = [];
        signature.forEach(item => {
            data_sign.push(item);
        })
        myContract.methods.name().call().then((result) => console.log(result))
        console.log(props.msgVerify)
        myContract.methods.getRecoveredAddress(
            "0x0739da1c678dfbd9fe7452382082567c18c7f448e2702a7177b3223415d145ab57fa11471dc7d8cf1d31c6c7b7f1fb6b02b471565392d5cb9dd2df0ade989cc41b",
            "0xd6601225b99170f73c5678fa7fe4924d3737836e458c690d4dcc93a84901b2c2"
        ).call().then(result => console.log(result))
        myContract.methods.verify(
            "0xedfbb352a9180afeb44a5dc89c55cbcd4053b731188df9abb0e75a003cfae6d4",
            "0x1e9548f14f6b535d8cf3ac96ce9e0a425c870c2ea651a7158600cd652e4a85897403bba8b746b456a03f9e07900e338a4450da2b75c121df972b9bfa7bfb86341c",
            "0x8B6ff17E6a61879661296CBA916BeC85F6649062"
        ).call().then(result => console.log(result));
        myContract.methods.verifyPayload(
            Date.now(),
            address.size,
            data_addr,
            data_sign,
            props.msgVerify
        ).call().then(result => {
            setIsVerify(result)
            setOpen(true);
        });
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // const action = (
    //     <React.Fragment>
    //         <Button color="secondary" size="small" onClick={handleClose}>
    //             UNDO
    //         </Button>
    //         <IconButton
    //             size="small"
    //             aria-label="close"
    //             color="inherit"
    //             onClick={handleClose}
    //         >
    //             <CloseIcon fontSize="small" />
    //         </IconButton>
    //     </React.Fragment>
    // );

    return (
        <>
            <Stack direction="row" spacing={3} justifyContent={"flex-start"}>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{props.network}</Typography>
                    {props.item.map(it => <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{it.name.charAt(0).toUpperCase() + it.name.slice(1)}</Typography>)}
                </Stack>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>Address</Typography>
                    {props.item.map(it => <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{it.address.substring(0)}</Typography>)}
                    {/* <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{"0x8B6ff17E6a61879661296CBA916BeC85F6649062".substring(0, 6)}</Typography> */}
                </Stack>
            </Stack>
            <Divider />
            <Box sx={{ '& > :not(style)': { m: 1 } }}>

                <Fab color="primary" aria-label="add">
                    <AddIcon onClick={handleOpen} />
                </Fab>
                <Fab color="secondary" aria-label="edit">
                    <EditIcon onClick={handleVerify} />
                </Fab>
            </Box>
            {isVerify
                ? <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Verify success!
                    </Alert>
                </Snackbar>
                : <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                // message="Note archived"
                // action={action}
                >
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Verify failed!
                    </Alert>
                </Snackbar>
            }

            {false &&
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box sx={style}>
                        <TextField
                            id="standard-select-currency"
                            select
                            label="Select"
                            value={currency}
                            onChange={handleChange}
                            helperText="Please select your currency"
                            variant="standard"
                            sx={{ m: 1 }}
                        >
                            {currencies.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField id="standard-basic" label="Address" variant="standard" sx={{ m: 1 }} />
                        <TextField id="standard-basic" label="Private Key" variant="standard" sx={{ m: 1 }} />

                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                    </Box>
                </Modal>}
        </>
    );
}