import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import {
  clearSelectedUser,
  createUser,
  fetchUserById,
  updateUser,
} from "../../redux/user/userSlice";

const UserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedUser } = useSelector((state) => state.user);

  const [user, setUser] = useState({
    name: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    roles: [],
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Available roles matching your backend RoleEnum
  const availableRoles = [
    { label: "User", value: "ROLE_USER" },
    { label: "Admin", value: "ROLE_ADMIN" },
  ];

  useEffect(() => {
    if (id) dispatch(fetchUserById(id));
    else dispatch(clearSelectedUser());
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      setUser({
        ...selectedUser,
        password: "", // Don't pre-fill password for security
        roles: selectedUser.roles || [],
      });
    }
  }, [selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation for new users
    if (!id && user.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Don't send empty password when updating
    const userData = { ...user };
    if (id && !userData.password) {
      delete userData.password;
    }

    if (id) {
      await dispatch(updateUser({ id, user: userData }));
    } else {
      await dispatch(createUser(userData));
    }
    navigate("/users");
  };

  const handlePasswordChange = (e) => {
    setUser({ ...user, password: e.target.value });
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (user.password !== e.target.value) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="card text-center mt-2 bg-light p-2">
        {id ? "Edit User" : "Add New User"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-3 card bg-light p-3">
          {/* Name and Lastname Row */}
          <div className="d-flex justify-content-center gap-3 mt-2">
            <div className="d-flex flex-column w-100">
              <label htmlFor="name" className="form-label mb-1">
                First Name *
              </label>
              <input
                id="name"
                className="form-control rounded w-100 p-2"
                type="text"
                placeholder="Enter first name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>
            <div className="d-flex flex-column w-100">
              <label htmlFor="lastname" className="form-label mb-1">
                Last Name *
              </label>
              <input
                id="lastname"
                className="form-control rounded w-100 p-2"
                type="text"
                placeholder="Enter last name"
                value={user.lastname}
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Email and Username Row */}
          <div className="d-flex justify-content-center gap-3 mt-3">
            <div className="d-flex flex-column w-100">
              <label htmlFor="email" className="form-label mb-1">
                Email *
              </label>
              <input
                id="email"
                className="form-control rounded w-100 p-2"
                type="email"
                placeholder="Enter email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <div className="d-flex flex-column w-100">
              <label htmlFor="username" className="form-label mb-1">
                Username *
              </label>
              <input
                id="username"
                className="form-control rounded w-100 p-2"
                type="text"
                placeholder="Enter username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="d-flex justify-content-center gap-3 mt-3">
            <div className="d-flex flex-column w-100">
              <label htmlFor="password" className="form-label mb-1">
                Password {id ? "(leave blank to keep current)" : "*"}
              </label>
              <input
                id="password"
                className="form-control rounded w-100 p-2"
                type="password"
                placeholder={id ? "Enter new password" : "Enter password"}
                value={user.password}
                onChange={handlePasswordChange}
                required={!id}
                minLength={6}
              />
            </div>
            {!id && (
              <div className="d-flex flex-column w-100">
                <label htmlFor="confirmPassword" className="form-label mb-1">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  className="form-control rounded w-100 p-2"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required={!id}
                />
                {passwordError && (
                  <div className="text-danger small mt-1">{passwordError}</div>
                )}
              </div>
            )}
          </div>

          {/* Roles Selection */}
          <div className="d-flex justify-content-center mt-3">
            <div className="d-flex flex-column w-100">
              <label htmlFor="roles" className="form-label mb-1">
                Roles *
              </label>
              <MultiSelect
                value={user.roles}
                onChange={(e) => setUser({ ...user, roles: e.value })}
                options={availableRoles}
                optionLabel="label"
                placeholder="Select roles"
                display="chip"
                className="w-100"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-3 text-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => navigate("/users")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
