import { Outlet } from "react-router-dom";
import NavigationMenu from "./navigation-menu";
import Footer from "./footer";
import { AuthProvider } from "../contexts/AuthContext";

export const Layout = () => {
  return (
    <AuthProvider>
      <div>
        <NavigationMenu />
        <main>
          <Outlet /> {/* Renders the child route's component */}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};
