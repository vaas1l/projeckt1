import { lazy } from "react";

import RootLayout from "../layout/RootLayout";
import AuthGuard from "../layout/AuthGuard";
import GuestGuard from "../layout/GuestGuard";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const todoRoutes = {
    path: "/",
    children: [
        {
            path: "/login",
            element: (
                <GuestGuard>
                    <LoginPage />
                </GuestGuard>
            ),
        },
        {
            path: "/",
            element: <AuthGuard> <RootLayout />  </AuthGuard> ,
            children: [
                {
                    path: "",
                    element: 
                        <HomePage />
                },
            ],
        },
    ],
    errorElement: <ErrorPage />,
};

export default todoRoutes;