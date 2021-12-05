import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import EditIcon from "@mui/icons-material/Edit";
import { Box, Divider, Typography, Modal, TextField, MenuItem } from '@mui/material';
import BasicModal from "./BasicModal"
import { StoreContext } from '../store';

import Web3 from 'web3'
import ChainIdentification from '../contracts/ChainIdentification'

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
    name: String
}) {

    const { isLoadingContext, accountContext } = React.useContext(StoreContext);
    const [accounts, setAccounts] = accountContext;

    const [currency, setCurrency] = React.useState('EUR');

    const onClick = () => {
        console.log(initContract("0x1234567890123456789012345678901234567891").defaultBlock)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Stack direction="row" spacing={3} justifyContent={"space-between"}>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{props.name}</Typography>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>Mainet</Typography>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>Mainet</Typography>
                </Stack>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>Address</Typography>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{"0x8B6ff17E6a61879661296CBA916BeC85F6649062".substring(0, 6)}</Typography>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{"0xFdd57658465a46125327D7e786411530C985FEa8".substring(0, 6)}</Typography>
                </Stack>
                <Stack>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>Private Key</Typography>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{"0x3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85".substring(0, 6)}</Typography>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{"0x3edae309e75a778f88af5d8017d93f477297abaaae143439604ea08b38c0ec85".substring(0, 6)}</Typography>
                </Stack>
            </Stack>
            <Divider />
            <Box sx={{ '& > :not(style)': { m: 1 } }}>

                <Fab color="primary" aria-label="add">
                    <AddIcon onClick={handleOpen} />
                </Fab>
                <Fab color="secondary" aria-label="edit">
                    <EditIcon />
                </Fab>
            </Box>
            {open &&
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