import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";

function App() {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={token ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
