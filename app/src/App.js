import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './config/route-config';
import useAuth from './hooks/useAuth';

function App() {
    const user = useAuth();

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
