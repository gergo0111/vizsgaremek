import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MainSite from './components/MainSite';
import ProtectedRoute from './components/ProtectedRoute';

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
