import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import SignInPage from "./pages/SignInPage";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/signin" element={<SignInPage></SignInPage>} />
          <Route path="/admin" element={<AdminPage></AdminPage>} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
