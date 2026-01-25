import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./pages/HomePage";
import ClassPage from "./pages/ClassPage";
import { ToastContainer } from "react-toastify";
import AppLayout from "./layouts/AppLayout";
import SlideViewer from "./components/SlideViewer";

function App() {
  const token =
    useSelector((state) => state.auth.token) ||
    localStorage.getItem("token");

  return (
    <>
      <ToastContainer />

      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" />}
        />

        {token && (
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/class/:classId/:classSlug"
              element={<ClassPage />}
            />
            <Route
              path="/class/:classId/slide/:slideId"
              element={<SlideViewer />}
            />

          </Route>
        )}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
