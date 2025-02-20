import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

export default function TextZadani({ refreshTodos }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!text.trim()) {
            setError('Task text cannot be empty!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, done: false }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            setText(''); 
            refreshTodos(); 
        } catch (error) {
            setError(`Failed to add task: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <Stack spacing={2} direction="row">
                <TextField
                    label="Task text"
                    variant="outlined"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading}
                    error={!!error}
                    helperText={error}
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                </Button>
            </Stack>
        </Box>
    );
}

TextZadani.propTypes = {
    refreshTodos: PropTypes.func.isRequired,
};