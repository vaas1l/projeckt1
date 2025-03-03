import { lazy } from "react";
import { Navigate } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../components/login"));
const RegisterPage = lazy(() => import("../components/register"));


const isAuthenticated = () => {
    return !!localStorage.getItem("user_id");
};

const todoRoutes = [
    { 
        path: "/", 
        element: isAuthenticated() ? <HomePage /> : <Navigate to="/login" /> 
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
];

export default todoRoutes;