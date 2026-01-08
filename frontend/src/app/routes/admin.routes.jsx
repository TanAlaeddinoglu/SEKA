import { Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RequireAdmin from "./RequireAdmin";
import AdminLayout from "../../layouts/AdminLayout";
import AdminCategoriesPage from "../../features/categories/pages/AdminCategoriesPage.jsx";
import AdminProductsPage from "../../features/products/pages/AdminProductsPage.jsx";
import AdminProductEditPage from "../../features/products/pages/AdminProductEditPage.jsx";
import AdminProductCreatePage from "../../features/products/pages/AdminProductCreatePage.jsx";

export const adminRoutes = (
    <Route
        path="/admin"
        element={
            <RequireAuth>
                <RequireAdmin>
                    <AdminLayout />
                </RequireAdmin>
            </RequireAuth>
        }
    >
        <Route index element={<div>Admin Dashboard</div>} />

        <Route path="categories" element={<AdminCategoriesPage />} />

        <Route path="products" element={<AdminProductsPage />} />

        <Route path="products/:id/edit" element={<AdminProductEditPage />} />

        <Route path= "products/new"  element= {<AdminProductCreatePage />}/>




    </Route>
);
