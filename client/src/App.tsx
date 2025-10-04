import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import LogInPage from "./pages/LogInPage";
import HomePage from "./pages/HomePage";

function App() {
  function PrivateRoute({children}) {
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
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
