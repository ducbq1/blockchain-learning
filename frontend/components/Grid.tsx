import * as React from 'react';
import { styled } from '@mui/material/styles';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";


import { Box, Divider, Typography, Paper, Grid, Stack, Button, Fab } from '@mui/material';


import Card from "./Card";
import Import from "./Import";


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function FullWidthGrid() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
                <Import name="Identities" />
                <Import name="Claim Issuers" />
                <Import name="Claim Checkers" />
            </Grid>
            <Grid item xs={6} md={6}>
                <Card />
            </Grid>
        </Grid>
    );
}
