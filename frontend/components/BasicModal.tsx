import * as React from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';

export default function BasicModal(props: {
    isOpen: boolean
}) {
    const [open, setOpen] = React.useState(props.isOpen);
    return (<>{open &&
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <p>Hello</p>
        </Modal>}
    </>);
}