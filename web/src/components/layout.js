// import React from "react";
// import Sidebar from "./Sidebar";

// const Layout = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem("token");

//   if (!isAuthenticated) {
//     return <div>{children}</div>;
//   }

//   return (
//     <div className="d-flex">
//       {/* Fixed Sidebar */}
//       <Sidebar />

//       {/* Main Content with proper margin */}
//       <div
//         className="flex-grow-1 bg-white p-4"
//         style={{
//           marginLeft: "300px",
//           width: "calc(100% - 220px)",
//           minHeight: "100vh",
//           overflowY: "auto",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const sidebarWidth = 200; // set your desired sidebar width

  if (!isAuthenticated) {
    return <div>{children}</div>;
  }

  return (
    <div className="d-flex">
      {/* Fixed Sidebar */}
      <Sidebar style={{ width: `${sidebarWidth}px` }} />

      {/* Main Content */}
      <div
        className="flex-grow-1 bg-white p-4"
        style={{
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          minHeight: "100vh",
          // overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
