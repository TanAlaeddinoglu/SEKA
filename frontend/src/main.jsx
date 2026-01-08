import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes } from "react-router-dom";
import QueryProvider from "./app/providers/QueryProvider";
import { AuthProvider } from "./app/providers/AuthProvider";
import { adminRoutes } from "./app/routes/admin.routes";
import { publicRoutes } from "./app/routes/public.routes";

import "./shared/styles/tokens.css";
import "./shared/styles/globals.css";
import {Toaster} from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    zIndex: 9999,
                },
            }}
        />
        <QueryProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {publicRoutes}
                        {adminRoutes}
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryProvider>
    </React.StrictMode>
);
