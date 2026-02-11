import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RequireAdmin from "./RequireAdmin";
import AdminLayout from "../../layouts/AdminLayout";

const AdminCategoriesPage = lazy(() =>
    import("../../features/categories/pages/AdminCategoriesPage.jsx")
);
const AdminProductsPage = lazy(() =>
    import("../../features/products/pages/AdminProductsPage.jsx")
);
const AdminProductEditPage = lazy(() =>
    import("../../features/products/pages/AdminProductEditPage.jsx")
);
const AdminProductCreatePage = lazy(() =>
    import("../../features/products/pages/AdminProductCreatePage.jsx")
);
const AdminUsersPage = lazy(() =>
    import("../../features/users/pages/AdminUsersPage.jsx")
);

const withSuspense = (element) => (
    <Suspense fallback={<div style={{ padding: "24px 20px" }}>Yükleniyor...</div>}>
        {element}
    </Suspense>
);

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
        <Route index element={withSuspense(<div>Admin Dashboard</div>)} />

        {/* USERS */}
        <Route path="users" element={withSuspense(<AdminUsersPage />)} />

        {/* CATEGORIES */}
        <Route path="categories" element={withSuspense(<AdminCategoriesPage />)} />

        {/* PRODUCTS */}
        <Route path="products" element={withSuspense(<AdminProductsPage />)} />
        <Route path="products/new" element={withSuspense(<AdminProductCreatePage />)} />
        <Route
            path="products/:id/edit"
            element={withSuspense(<AdminProductEditPage />)}
        />
    </Route>
);
