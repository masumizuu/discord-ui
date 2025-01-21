import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './Route.tsx';
import { ServerProvider } from './backend/context/ServerContext';
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <ServerProvider>
            <HelmetProvider>
                <Toaster />
                <AppRouter />
            </HelmetProvider>
        </ServerProvider>
    </React.StrictMode>
);
