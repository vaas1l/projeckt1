import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function ButtonAppBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch('/api/auth/logout', { method: 'POST' })
            .then(() => {
                navigate('/login');
            })
            .catch(error => console.error('Logout failed:', error));
    };


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
                    <Button onClick={handleLogout}>Logout</Button>


                </Toolbar>
            </AppBar>
        </Box>
    );
}