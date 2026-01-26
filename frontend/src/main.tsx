import { createBrowserRouter, RouterProvider } from "react-router";
import { MainSite } from "./components/MainSite";
import Login from "./components/Login";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { UserManagement } from "./components/UserManagement";
import { NewUserAdd } from "./components/NewUserAdd";


const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/fooldal",
    Component: MainSite,
  },
  {
    path: "/felhasznalok-kezelese",
    Component: UserManagement,
  },
  {
    path: "/uj-felhasznalo",
    Component: NewUserAdd,
  },
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)