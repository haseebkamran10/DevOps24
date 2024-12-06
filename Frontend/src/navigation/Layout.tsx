import { Outlet } from "react-router-dom";
import NavigationMenu from "./navigation-menu";
import Footer from "./footer";
import { AuthProvider } from "../contexts/AuthContext";
import { PersistentProvider } from "@/contexts/PersistentContext";

export const Layout = () => {
  return (
    <AuthProvider>
        <PersistentProvider>
        <NavigationMenu />
        <main>
          <Outlet />
        </main>
        <Footer />
      </PersistentProvider>
    </AuthProvider>
  );
};
