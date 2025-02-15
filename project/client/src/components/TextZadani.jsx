import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicTextFields() {
    return (
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
        >
            <Stack spacing={2} direction="row">
                <TextField id="outlined-basic" label="Text zadani" variant="outlined" />
                <Button variant="text">Přidat</Button>
            </Stack>
        </Box>

    );
}