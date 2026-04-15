import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { MainSite } from './components/MainSite';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserManagement } from './components/users/UserManagement';
import { ToolsList } from './components/tools/ToolsList';
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
          path="/tools"
          element={
            <ProtectedRoute adminOnly>
              <ToolsList />
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
