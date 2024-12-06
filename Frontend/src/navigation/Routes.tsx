import { RouteObject } from "react-router-dom";
import SupportPage from "../views/support/support-page";
import Home from "../views/home/home";
import Profile from "../views/profile/profile_overview";
import { Layout } from "./Layout";
import ProductCatalogPage from "@/views/product-catalogue/product-catalogue-page";
import LionPainting from "@/views/items/SingleProductPage";
import LoginPage from "@/views/login/login";
import PaymentPage from "@/views/PaymentPage/PaymentPage";
import WinnerPage from "@/views/WinnerPage/WinnerPage";
import NewAuctionPage from "@/views/newAuctionPage";
import SignupPage from "@/views/SignupPage/SignupPage";
import ConfirmationPage from "@/views/Confirmation";


export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        index: true, 
        element: <Home />,
      },
      {
        path: "products",
        element: <ProductCatalogPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "SingleProductPage",
        element: <LionPainting />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "paymentpage",
        element: <PaymentPage/>,
      },
      {
        path: "confirmation",
        element: <ConfirmationPage />,
      },
      {
        path: "winners",
        element: <WinnerPage />,
      },
      {
        path: "new-auction",
        element: <NewAuctionPage />,
      },
    ],
  },
  
];
