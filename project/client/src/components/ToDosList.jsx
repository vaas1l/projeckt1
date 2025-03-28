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
import TodoAkce from "../components/TodoAkce";
import DueDate from "../components/DueDate";

export default function ToDosList({ filter }) {
    const todos = useTodos();
    const refreshTodos = useRefreshTodos();




    const handleDelete = async (_id) => {
        try {
            const response = await fetch(`/api/todos/${_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            refreshTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'all') return true;
        if (filter === 'done') return todo.done === 1 || todo.done === true;
        if (filter === 'not_done') return todo.done === 0 || todo.done === false;
        if (filter === 'priority') return [1, 2, 3].includes(todo.priority);
        return true;
    });

    if (filter === 'priority') {
        filteredTodos.sort((a, b) => a.priority - b.priority);
    }

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
                    {filteredTodos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">No tasks found.</TableCell>
                        </TableRow>
                    ) : (
                        filteredTodos.map((todo, index) => (
                            <TableRow key={todo._id || index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell align="left">{todo.text}</TableCell>
                                <TableCell align="center">
                                    {todo.done === 1 || todo.done === true ? 'Ano' : 'Ne'}
                                </TableCell>
                                <TableCell align="center">
                                    <TodoAkce id={todo._id} priority={todo.priority} refreshTodos={refreshTodos} />
                                </TableCell>
                                <TableCell align="center">
                                    {todo.created_at
                                        ? new Date(todo.created_at).toISOString().slice(0, 10)
                                        : 'N/A'
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    <DueDate id={todo._id} dueDate={todo.due_date} refreshTodos={refreshTodos} />
                                </TableCell>
                                <TableCell align="center">
                                    <ToggleTaskStatus id={todo._id} done={todo.done === 1 || todo.done === true} refreshTodos={refreshTodos} />
                                    <Button variant="contained" color="error" onClick={() => handleDelete(todo._id)}>
                                        DELETE
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

ToDosList.propTypes = {
    filter: PropTypes.string.isRequired,
};