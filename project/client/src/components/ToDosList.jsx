import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ToDosList({ todos, setTodos }) {

    const handleDelete = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell align="center">Text</TableCell>
                        <TableCell align="right">Hotovo</TableCell>
                        <TableCell align="right">Akce</TableCell>
                        <TableCell align="right">Created At</TableCell>
                        <TableCell align="right">dueDate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {todos.map((todo, index) => (
                        <TableRow
                            key={todo.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell align="left">{todo.text}</TableCell>
                            <TableCell align="center">{todo.completed ? 'Yes' : 'No'}</TableCell>
                            <TableCell align='center'>{todo.akce}</TableCell>
                            <TableCell align="center">{todo.createdAt}</TableCell>
                            <TableCell align="center">{todo.dueDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
