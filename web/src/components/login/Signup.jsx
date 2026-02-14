import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // In Signup component, update the handleSubmit function:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Password and confirmation do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Register through API - ALWAYS set as ROLE_USER for signup
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: form.name,
          lastname: form.lastname,
          email: form.email,
          username: form.username,
          password: form.password,
          roles: ["ROLE_USER"], // Force ROLE_USER for signup
        },
      );

      // If registration successful, redirect to login page
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow" style={{ width: "100%", maxWidth: "500px" }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">Sign Up</h3>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  id="name"
                  name="name"
                  className="form-control form-control-lg"
                  placeholder="Enter first name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <input
                  id="lastname"
                  name="lastname"
                  className="form-control form-control-lg"
                  placeholder="Enter last name"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <input
                id="email"
                name="email"
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                id="username"
                name="username"
                className="form-control form-control-lg"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="col-md-6 mb-3">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg w-100 mb-3"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Registering...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="text-center">
              <p className="mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
