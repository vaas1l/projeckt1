import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../components/login'));

const isAuthenticated = () => {
    const user_id = localStorage.getItem('user_id');
    return !!user_id; 
};

const todoRoutes = [
    { path: '/', element: isAuthenticated() ? <HomePage /> : <Navigate to="/login" /> },
    { path: '/login', element: <LoginPage /> },

];

export default todoRoutes;