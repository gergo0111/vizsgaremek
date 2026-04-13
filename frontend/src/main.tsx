import { createBrowserRouter, RouterProvider } from "react-router";
import { MainSite } from "./components/MainSite";
import Login from "./components/Login";
import { createRoot } from "react-dom/client";
import { Component, StrictMode } from "react";
import { UserManagement } from "./components/users/UserManagement";
import { NewUserAdd } from "./components/users/NewUserAdd";
import { Tools } from "./components/tools/ToolsList";
import { newToolAdd } from "./components/tools/NewToolAdd";
import { PatchTools } from "./components/tools/PatchTools";
import { UserPatch } from "./components/users/UserPatch";
import { NewPass } from "./components/users/NewPass";
import { NewWorkAdd } from "./components/works/NewWorkAdd";
import ModifyWork from "./components/works/ModifyWork";

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
    path: "/felhasznalo-modositas/:user_id",
    Component: UserPatch,
  },
  {
    path: "/jelszo-modositas/:user_id",
    Component: NewPass,
  },
  {
    path: "/eszkozok",
    Component: Tools,
  },
  {
    path: "/uj-eszkoz",
    Component: newToolAdd,
  },
  {
    path: "eszkoz-modositas/:eszkoz_id",
    Component: PatchTools,
  },
  {
    path: "/uj-munka",
    Component: NewWorkAdd,
  },
  {
    path: "/modify-work/:munka_id",
    Component: ModifyWork,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)