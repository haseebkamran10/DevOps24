import { Outlet } from "react-router-dom";
import NavigationMenu from "./navigation-menu";
import Footer from "./footer";

export const Layout = () => {
  return (
    <>
      <NavigationMenu />
      <main>
        <Outlet /> {/* Renders the child route's component */}
      </main>
      <Footer />
    </>
  );
};
