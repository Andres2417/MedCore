import './index.css';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import LogInPage from "./pages/LogInPage";
import HomePage from "./pages/HomePage";
import BulkUserUploader from './pages/BulkUserUploader';
import ListUsers from './pages/ListUsers';
function App() {
  function PrivateRoute({ children }: { children: ReactNode }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>} />
          <Route path="/login" element={<LogInPage></LogInPage>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/admin/upload-users" element={<PrivateRoute><BulkUserUploader /></PrivateRoute>} />
          <Route path="/admin/list-users" element={<PrivateRoute><ListUsers /></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
