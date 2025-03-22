import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { useRefreshTodos } from '../stores/todos';
import { useAuthStore } from '../stores/auth'; 

export default function TextZadani() {
    const user_id = useAuthStore((state) => state.user?.id) || localStorage.getItem('user_id');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const refreshTodos = useRefreshTodos();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!text.trim()) {
            setError('Task text cannot be empty!');
            return;
        }

        if (!user_id) {
            setError('Error: User is not authenticated.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5173/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, done: 0, priority: 2, user_id }),
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
                    disabled={loading || !user_id}
                    error={!!error}
                    helperText={error || (!user_id ? 'You must be logged in to add tasks' : '')}
                />
                <Button type="submit" variant="contained" disabled={loading || !user_id}>
                    {loading ? 'Adding...' : 'Add'}
                </Button>
            </Stack>
        </Box>
    );
}

TextZadani.propTypes = {
    refreshTodos: PropTypes.func.isRequired,
};