import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";
import { AuthContext } from "../contexts/AuthContext";
import defaultPhotoUrl from "../assets/default_profile_photo.jpg";

const Sidebar: React.FC = () => {
  const auth = useContext(AuthContext);

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  if (!auth?.user) {
    return null;
  }

  const { user, logoutUser } = auth;

  const isAdmin = user.role === "admin";

  const isCompany = user.role === "company";

  const isJobSeeker = user.role === "job_seeker";

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo-details">
          <img
            src={defaultPhotoUrl}
            alt="Profile"
            className="avatar-sidebar rounded-circle"
          />

          <div
            className={`${
              isSidebarOpen ? "avatar-name" : "avatar-name-not-show"
            }`}
          >
            {user.first_name + " " + user.last_name}
          </div>

          <i
            className={`${
              isSidebarOpen ? "bx bx-chevron-left" : "bx bx-chevron-right"
            }`}
            id="btn"
            onClick={toggleSidebar}
          ></i>
        </div>

        <ul className="nav-list">
          <li>
            <Link to="jobs">
              <i className="bx bx-briefcase"></i>

              <span className="links_name">Jobs</span>
            </Link>

            <span className="tooltip">Jobs</span>
          </li>

          {isAdmin && (
            <li>
              <Link to="categories/create">
                <i className="bx bx-category"></i>

                <span className="links_name">Manage Categories</span>
              </Link>

              <span className="tooltip">Manage Categories</span>
            </li>
          )}

          {isJobSeeker && (
            <li>
              <Link to="applications">
                <i className="bx bx-file"></i>

                <span className="links_name">My Applications</span>
              </Link>

              <span className="tooltip">My Applications</span>
            </li>
          )}

          {isCompany && (
            <li>
              <Link to="company-applications">
                <i className="bx bx-folder"></i>

                <span className="links_name">Applications</span>
              </Link>

              <span className="tooltip">Applications</span>
            </li>
          )}

          {isJobSeeker && (
            <li>
              <Link to="jobseeker-profile">
                <i className="bx bx-user"></i>

                <span className="links_name">Job Seeker Profile</span>
              </Link>

              <span className="tooltip">Job Seeker Profile</span>
            </li>
          )}

          {isCompany && (
            <>
              <li>
                <Link to="company-profile">
                  <i className="bx bx-building"></i>

                  <span className="links_name">Company Profile</span>
                </Link>

                <span className="tooltip">Company Profile</span>
              </li>
              <li>
                <Link to="company-jobs">
                  <i className="bx bx-list-ul"></i>

                  <span className="links_name">My Job Posts</span>
                </Link>

                <span className="tooltip">My Job Posts</span>
              </li>
            </>
          )}
          <li>
            <Link to="settings">
              <i className="bx bx-cog"></i>

              <span className="links_name">Settings</span>
            </Link>

            <span className="tooltip">Settings</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
