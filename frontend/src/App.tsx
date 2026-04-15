import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { MainSite } from './components/MainSite';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserManagement } from './components/users/UserManagement';
import { UsersList } from './components/users/UsersList';
import { NewUserAdd } from './components/users/NewUserAdd';
import { UserPatch } from './components/users/UserPatch';
import { ToolsList } from './components/tools/ToolsList';
import { NewToolAdd } from './components/tools/NewToolAdd';
import { PatchTools } from './components/tools/PatchTools';
import { NewWorkAdd } from './components/works/NewWorkAdd';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainSite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute adminOnly>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/felhasznalok-kezelese"
          element={
            <ProtectedRoute adminOnly>
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uj-felhasznalo"
          element={
            <ProtectedRoute adminOnly>
              <NewUserAdd />
            </ProtectedRoute>
          }
        />

        <Route
          path="/felhasznalo-modositas/:user_id"
          element={
            <ProtectedRoute adminOnly>
              <UserPatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fooldal"
          element={
            <ProtectedRoute>
              <MainSite />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tools"
          element={
            <ProtectedRoute adminOnly>
              <ToolsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eszkozok-kezelese"
          element={
            <ProtectedRoute adminOnly>
              <ToolsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uj-eszkoz"
          element={
            <ProtectedRoute adminOnly>
              <NewToolAdd />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eszkoz-modositas/:eszkoz_id"
          element={
            <ProtectedRoute adminOnly>
              <PatchTools />
            </ProtectedRoute>
          }
        />

        <Route
          path="/works/new"
          element={
            <ProtectedRoute adminOnly>
              <NewWorkAdd />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
