import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { useColorScheme, CssVarsProvider } from '@mui/joy/styles';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="soft">Change mode</Button>;
  }

  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(event, newMode) => {
        setMode(newMode);
      }}
      sx={{ width: 'max-content', mb: 2, mx: 'auto' }}
    >
      <Option value="system">System</Option>
      <Option value="light">Light</Option>
      <Option value="dark">Dark</Option>
    </Select>
  );
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main>
        <>
        <CssVarsProvider>
      <CssBaseline />
      <ModeToggle />
      <Sheet
        sx={{
          width: 300,
          mx: 'auto',
          my: 4,
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Create an account</b>
          </Typography>
          <Typography level="body-sm">Register to get started.</Typography>
        </div>
        {error && <Typography color="danger">{error}</Typography>}
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            placeholder="your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button sx={{ mt: 1 }} onClick={handleRegister}>
          Sign Up
        </Button>
      </Sheet>
      </CssVarsProvider>
      </>
    </main>
  );
}