import { createBrowserRouter, RouterProvider } from "react-router";
import { MainSite } from "./components/MainSite";
import Login from "./components/Login";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";


const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/fooldal",
    Component: MainSite,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)