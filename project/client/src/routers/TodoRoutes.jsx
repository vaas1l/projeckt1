import React, { lazy } from 'react'

const HomePage = lazy(() => import('../pages/HomePage'));

const todoRoutes = {
    path: '/',
    element: <HomePage />,
}

export default todoRoutes;