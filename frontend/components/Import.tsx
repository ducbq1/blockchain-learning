import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import EditIcon from "@mui/icons-material/Edit";
import { Box, Divider, Typography, Modal } from '@mui/material';
import BasicModal from "./BasicModal"

export default function Import(props: {
    name: String
}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Stack direction="row" spacing={3} justifyContent={"space-between"}>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{props.name}</Typography>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>Mainet</Typography>
                </Stack>
                <Stack direction="column">
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>Address</Typography>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>{"0x8B6ff17E6a61879661296CBA916BeC85F6649062".substring(0, 6)}</Typography>
                </Stack>
                <Stack>
                    <Typography variant="body1" my={0.5} style={{ fontWeight: 600 }}>Owner</Typography>
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
                    <p>Hello</p>
                </Modal>}
        </>
    );
}