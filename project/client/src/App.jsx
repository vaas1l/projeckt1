import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import todoRoutes from './routers/TodoRoutes';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  shape: { borderRadius: 4 }, 
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {}
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {todoRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}