import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Router from './routers';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const theme = createTheme({
  shape: { borderRadius: 4 },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={Router()} />
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
}