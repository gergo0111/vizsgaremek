import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MainSite from './components/MainSite';
import ProtectedRoute from './components/ProtectedRoute';
import { UsersList } from './components/users/UsersList';
import { Tools } from './components/tools/ToolsList';
import { NewWorkAdd } from './components/works/NewWorkAdd';
import { NewUserAdd } from './components/users/NewUserAdd';
import { UserPatch } from './components/users/UserPatch';
import { newToolAdd as NewToolAdd } from './components/tools/NewToolAdd';
import { PatchTools } from './components/tools/PatchTools';
import { ModifyWork } from './components/works/ModifyWork';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/fooldal"
          element={
            <ProtectedRoute>
              <MainSite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/felhasznalok-kezelese"
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eszkozok"
          element={
            <ProtectedRoute>
              <Tools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uj-munka"
          element={
            <ProtectedRoute>
              <NewWorkAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uj-felhasznalo"
          element={
            <ProtectedRoute>
              <NewUserAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/felhasznalo-modositas/:user_id"
          element={
            <ProtectedRoute>
              <UserPatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uj-eszkoz"
          element={
            <ProtectedRoute>
              <NewToolAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eszkoz-modositas/:eszkoz_id"
          element={
            <ProtectedRoute>
              <PatchTools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/munka-lista"
          element={
            <ProtectedRoute>
              <MainSite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/munka-modositas/:munka_id"
          element={
            <ProtectedRoute>
              <ModifyWork />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <MainSite />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
