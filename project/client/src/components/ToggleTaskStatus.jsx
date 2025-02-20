import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

export default function ToggleTaskStatus({ id, done }) {
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

            console.log(`Task ${id} updated to ${!done}`);
            window.location.reload();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
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
};