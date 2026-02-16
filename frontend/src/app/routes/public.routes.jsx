import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

const HomePage = lazy(() => import("../../pages/HomePage"));
const LoginPage = lazy(() => import("../../features/auth/pages/LoginPage.jsx"));
const CategoriesPage = lazy(() => import("../../pages/CategoriesPage.jsx"));
const ProductsPage = lazy(() => import("../../pages/ProductsPage.jsx"));
const ProductDetailPage = lazy(() => import("../../pages/ProductDetailPage.jsx"));
const AboutPage = lazy(() => import("../../pages/AboutPage.jsx"));
const CatalogPage = lazy(() => import("../../pages/CatalogPage.jsx"));
const ContactPage = lazy(() => import("../../pages/ContactPage.jsx"));

const withSuspense = (element) => (
    <Suspense fallback={<div style={{ padding: "24px 20px" }}>Yükleniyor...</div>}>
        {element}
    </Suspense>
);

export const publicRoutes = (
    <>
        <Route path="/" element={<MainLayout />}>
            <Route index element={withSuspense(<HomePage />)} />
            <Route path="kategoriler" element={withSuspense(<CategoriesPage />)} />
            <Route path="urunler" element={withSuspense(<ProductsPage />)} />
            <Route path="urunler/:id" element={withSuspense(<ProductDetailPage />)} />
            <Route path="hakkimizda" element={withSuspense(<AboutPage />)} />
            <Route path="katalog" element={withSuspense(<CatalogPage />)} />
            <Route path="iletisim" element={withSuspense(<ContactPage />)} />
        </Route>

        <Route path="/login" element={withSuspense(<LoginPage />)} />
        <Route path="/unauthorized" element={<div>Yetkisiz</div>} />
    </>
);
