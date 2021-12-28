import * as React from 'react';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import { Box, Divider, Typography, Paper, Grid, Stack, Button, Fab } from '@mui/material';
import MyStore, { StoreContext } from '../store';


import Card from "./Card";
import Import from "./Import";


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const item = [
    {
        name: "rinkeby",
        address: "TEST ADDRESS"
    },
    {
        name: "goerli",
        address: "TEST ADDRESS"
    },
    {
        name: "goerli",
        address: "TEST ADDRESS"
    }
]
// const itemIdentification = [
//     {
//         name: "mainnet",
//         address: "0x8B6ff17E6a61879661296CBA916BeC85F6649062"
//     },
//     {
//         name: "ropsten",
//         address: "0x3AA528B07d997b2E78e7BFB96fdFB7CA31cE0e46"
//     },
//     {
//         name: "ropsten",
//         address: "0xFdd57658465a46125327D7e786411530C985FEa8"
//     }
// ]



export default function FullWidthGrid({ msgVerify }) {
    const { isLoadingContext, accountContext, addressContext, signatureContext } = React.useContext(StoreContext);
    const [address, setAddress] = addressContext;
    const [signature, setSignature] = signatureContext;
    const itemIdentification = []
    console.log(address)
    address.forEach(item => {
        itemIdentification.push({
            name: "ropsten",
            address: item
        })
    })
    return (
        <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
                <React.Fragment key="1">
                    <Import key={Math.random().toString(36).substring(2, 9)} network="Identities" item={itemIdentification} msgVerify={msgVerify} />
                </React.Fragment>
                <React.Fragment key="2">
                    <Import key={Math.random().toString(36).substring(2, 9)} network="Claim Issuers - Claim Checkers" item={item} msgVerify={msgVerify} />
                </React.Fragment>
            </Grid>
            <Grid item xs={6} md={6}>
                <Card />
            </Grid>
        </Grid>
    );
}
