import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { deleteUser, fetchUsers } from "../../redux/user/userSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.user);

  // Get current user roles from auth state
  const currentUserRoles = useSelector((state) => state.auth.roles || []);
  const isAdmin = currentUserRoles.includes("ROLE_ADMIN");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <div className="d-flex gap-1">
        {rowData.roles &&
          rowData.roles.map((role, index) => {
            let severity = "info";
            if (role === "ROLE_ADMIN") severity = "danger";
            if (role === "ROLE_MANAGER") severity = "warning";

            // Remove "ROLE_" prefix for display
            const displayRole = role.replace("ROLE_", "");

            return (
              <Tag
                key={index}
                value={displayRole}
                severity={severity}
                className="p-tag-sm"
              />
            );
          })}
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    // Only show actions for admin users
    if (!isAdmin) {
      return <span className="text-muted">View only</span>;
    }

    return (
      <div className="d-flex gap-2">
        <button
          onClick={() => navigate(`/users/edit/${rowData.id}`)}
          className="btn btn-sm btn-warning"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(rowData.id)}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    );
  };

  const status = loading ? "loading" : error ? "failed" : "succeeded";

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">User List</h3>
        {/* Only show "Add User" button for admins */}
        {isAdmin && (
          <button
            onClick={() => navigate("/users/add")}
            className="btn btn-primary"
          >
            Add User
          </button>
        )}
      </div>

      {/* Show permission info for non-admin users */}
      {!isAdmin && (
        <div className="alert alert-info mb-3" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          You are viewing the user list in <strong>read-only mode</strong>. Only
          administrators can add, edit, or delete users.
        </div>
      )}

      {status === "loading" && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {status === "failed" && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}

      <DataTable
        value={users}
        paginator
        rows={5}
        stripedRows
        rowsPerPageOptions={[5, 10, 20]}
        tableStyle={{ minWidth: "50rem" }}
        emptyMessage="No users found."
      >
        <Column field="name" header="First Name" sortable />
        <Column field="lastname" header="Last Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="username" header="Username" sortable />
        <Column field="roles" header="Roles" body={roleBodyTemplate} />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ width: isAdmin ? "200px" : "120px" }}
        />
      </DataTable>
    </div>
  );
};

export default UserList;
