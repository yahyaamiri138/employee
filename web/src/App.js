import React, { use, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadFromStorage } from "./redux/auth/authSlice";
import UserForm from "./components/user/UserForm";
import UserList from "./components/user/UserList";
import Layout from "./components/layout";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import ProtectedRoute from "./components/login/ProtectedRoute";
import AdminRoute from "./components/login/AdminRoute";

function App() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(loadFromStorage());
    setIsInitialized(true);
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main route - Everyone can access UserList */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <UserList />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/users/add"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout>
                  <UserForm />
                </Layout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/edit/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout>
                  <UserForm />
                </Layout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
