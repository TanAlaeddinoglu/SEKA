import { Route } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../features/auth/pages/LoginPage.jsx";

export const publicRoutes = (
    <>
        <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<div>Yetkisiz</div>} />
    </>
);
