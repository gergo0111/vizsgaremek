import { createBrowserRouter, RouterProvider } from "react-router";
import { MainSite } from "./components/MainSite";
import Login from "./components/Login";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { UserManagement } from "./components/users/UserManagement";
import { NewUserAdd } from "./components/users/NewUserAdd";
import { Tools } from "./components/tools/ToolsList";


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
  {
    path: "/eszkozok",
    Component: Tools,
  },
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)