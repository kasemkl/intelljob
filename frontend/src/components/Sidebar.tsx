import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";
import { AuthContext } from "../contexts/AuthContext";

const Sidebar: React.FC = () => {
  const auth = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  if (!auth) {
    return null;
  }

  const { user, logoutUser } = auth;

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="logo-details">
        <i className="bx bxl-c-plus-plus icon"></i>
        <div className="logo_name">Intelljob</div>
        <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="settings">
            <i className="bx bx-cog"></i>
            <span className="links_name">Settings</span>
          </Link>
          <span className="tooltip">Settings</span>
        </li>
        {user?.role === "job_seeker" && (
          <li>
            <Link to="jobseeker-profile">
              <i className="bx bx-user"></i>
              <span className="links_name">Job Seeker Profile</span>
            </Link>
            <span className="tooltip">Job Seeker Profile</span>
          </li>
        )}
        {user?.role === "company" && (
          <li>
            <Link to="company-profile">
              <i className="bx bx-building"></i>
              <span className="links_name">Company Profile</span>
            </Link>
            <span className="tooltip">Company Profile</span>
          </li>
        )}
        <li>
          <Link to="jobs">
            <i className="bx bx-briefcase"></i>
            <span className="links_name">Jobs</span>
          </Link>
          <span className="tooltip">Jobs</span>
        </li>

        <li className="profile">
          <div className="profile-details">
            {user?.profile_picture && (
              <img src={user.profile_picture} alt="Profile" />
            )}
            <div className="name_job">
              <div className="name">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="job">{user?.role}</div>
            </div>
          </div>
          <i
            className="bx bx-log-out"
            id="log_out"
            onClick={logoutUser}
            role="button"
            aria-label="Logout"
          ></i>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
