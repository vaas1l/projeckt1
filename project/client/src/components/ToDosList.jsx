import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import ToggleTaskStatus from '../components/ToggleTaskStatus';
import { useTodos, useRefreshTodos } from '../stores/todos';

export default function ToDosList() {
    const todos = useTodos();
    const refreshTodos = useRefreshTodos();

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
    
            console.log(`Deleted task ${id}`); 
            refreshTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell align="center">Text</TableCell>
                        <TableCell align="center">Hotovo</TableCell>
                        <TableCell align="center">Akce</TableCell>
                        <TableCell align="center">Created At</TableCell>
                        <TableCell align="center">Due Date</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {todos.map((todo, index) => (
                        <TableRow key={todo.id || index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell align="left">{todo.text}</TableCell>
                            <TableCell align="center">{todo.done ? 'Ano' : 'Ne'}</TableCell>
                            <TableCell align="center">{todo.akce ?? 'N/A'}</TableCell>
                            <TableCell align="center">{todo.createdAt || 'N/A'}</TableCell>
                            <TableCell align="center">{todo.dueDate || 'N/A'}</TableCell>
                            <TableCell align="center">
                                <ToggleTaskStatus id={todo.id} done={todo.done} refreshTodos={refreshTodos} />
                                <Button variant="contained" color="error" onClick={() => handleDelete(todo.id)}>
                                    DELETE
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

ToDosList.propTypes = {
    todos: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        text: PropTypes.string.isRequired,
        done: PropTypes.bool.isRequired,
        akce: PropTypes.string,
        createdAt: PropTypes.string,
        dueDate: PropTypes.string,
    })),
    refreshTodos: PropTypes.func.isRequired,
};