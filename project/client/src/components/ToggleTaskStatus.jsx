import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useRefreshTodos } from '../stores/todos';
export default function ToggleTaskStatus({ id, done }) {
    const refreshTodos = useRefreshTodos();
    const handleToggle = async () => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: !done }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update task status: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
        refreshTodos();

    };

    return (
        <Button variant="contained" onClick={handleToggle}>
            zmenit
        </Button>
    );
}

ToggleTaskStatus.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    done: PropTypes.bool.isRequired,
    refreshTodos: PropTypes.func.isRequired,
};