import { lazy } from "react";

import RootLayout from "../layout/RootLayout";
import GuestGuard from "../layout/GuestGuard";


const LoginPage = lazy(() => import("../pages/loginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const authRoutes = {
    path: "/",
    children: [
        {
            path: "/",
            element: <GuestGuard> <RootLayout />  </GuestGuard> ,
            children: [
                {
                    path: "login",
                    element: (
                        <LoginPage />
                    )
                },
                {
                    path: "register",
                    element: <RegisterPage />
                }
            ],
        },
    ],
    errorElement: <ErrorPage />,
};

export default authRoutes;