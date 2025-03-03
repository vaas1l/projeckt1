import { useNavigate } from 'react-router-dom'; 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { useRefreshTodos } from '../stores/todos';

export default function ButtonAppBar() {
    const refreshTodos = useRefreshTodos();
    refreshTodos();

    const navigate = useNavigate(); 

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        ToDos!
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}