import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./pages/HomePage";
import ClassPage from "./pages/ClassPage";
import { ToastContainer } from "react-toastify";
import AppLayout from "./layouts/AppLayout";
import SlideViewer from "./components/SlideViewer";
import { initializeAuthListener } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const reduxToken = useSelector((state) => state.auth.token);
  const authInitialized = useSelector((state) => state.auth.authInitialized);
  const localToken = localStorage.getItem("token");
  const token = reduxToken || localToken;

  useEffect(() => {
    const unsubscribe = dispatch(initializeAuthListener());
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [dispatch]);

  if (!authInitialized) {
    return null;
  }

  return (
    <>
      <ToastContainer />

      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" replace />}
        />

        <Route element={token ? <AppLayout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/class/:slug" element={<ClassPage />} />
          <Route path="/class/:slug/slide/:slideId" element={<SlideViewer />} />
        </Route>

        <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default App;