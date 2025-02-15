import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function BasicButtonGroup() {
    return (
        <ButtonGroup variant="outlined" aria-label="Basic button group">

            <Button>Vše</Button>
            <Button>Udělaní</Button>
            <Button>Neudělaní</Button>
            <Button>Priority</Button>
        </ButtonGroup>
    );
}
