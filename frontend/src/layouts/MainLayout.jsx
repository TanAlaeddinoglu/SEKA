import { Outlet } from "react-router-dom";
import Header from "../shared/components/header/Header";
import Footer from "../shared/components/footer/Footer";
import Breadcrumbs from "../shared/components/breadcrumbs/Breadcrumbs";
import WhatsAppFloatButton from "../shared/components/whatsapp/WhatsAppFloatButton";

export default function MainLayout() {
    return (
        <>
            <Header />
            <Breadcrumbs />
            <Outlet />
            <Footer />
            <WhatsAppFloatButton />
        </>
    );
}
