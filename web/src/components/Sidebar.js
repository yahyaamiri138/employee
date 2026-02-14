import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const navigate = useNavigate();
  const roles = useSelector((state) => state.auth.roles || []);
  const username = useSelector((state) => state.auth.username);
  const isAdmin = roles.includes("ROLE_ADMIN");

  // Don't show sidebar if user is not logged in
  if (!localStorage.getItem("token")) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div
      className="d-flex flex-column p-3 bg-light"
      style={{
        width: "220px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="flex-grow-1">
        <h4 className="mb-4">Dashboard</h4>
        {/* <div className="mb-3 text-center">
          <small className="text-muted">Welcome</small>
          <br />
          <strong>{username || "User"}</strong>
          <br />
          <small className="text-muted">
            {isAdmin ? "Administrator" : "Regular User"}
          </small>
        </div> */}
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          {/* User List navigation - everyone can access */}
          <li className="nav-item mb-2">
            <button
              onClick={() => navigate("/")}
              className="nav-link text-dark btn btn-link text-start w-100 p-0 border-0"
              style={{ textDecoration: "none" }}
            >
              <i className="bi bi-people me-2"></i>
              User List
            </button>
          </li>

          {/* Only show "Add User" for admins */}
          {/* {isAdmin && (
            <li className="nav-item mb-2">
              <button
                onClick={() => navigate("/users/add")}
                className="nav-link text-dark btn btn-link text-start w-100 p-0 border-0"
                style={{ textDecoration: "none" }}
              >
                <i className="bi bi-person-plus me-2"></i>
                Add New User
              </button>
            </li>
          )} */}
        </ul>
      </div>

      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
