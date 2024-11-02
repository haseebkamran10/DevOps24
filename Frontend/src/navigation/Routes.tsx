import { RouteObject } from "react-router-dom";
import SupportPage from "../views/support/support-page";
import Home from "../views/home/home";
import Profile from "../views/profile/profile_overview";
import { Layout } from "./Layout";
import ProductCatalogPage from "@/views/product-catalogue/product-catalogue-page";
import LionPainting from "@/views/items/lion-painting";
import LoginPage from "@/views/login/login";
import PaymentPage from "@/views/PaymentPage/PaymentPage";
import WinnerPage from "@/views/WinnerPage/WinnerPage";
import NewAuctionPage from "@/views/newAuctionPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />, // Use Layout as the root element
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <ProductCatalogPage />,
      },
      {
        path: "/support",
        element: <SupportPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/1",
        element: <LionPainting />,
      },

      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/paymentpage",
        element: <PaymentPage totalAmount={0} itemTitle={""} />,
      },
      { path: "/winners", element: <WinnerPage /> },
      {
        path: "/new-auction",
        element: <NewAuctionPage />,
      },
    ],
  },
];
