import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/nav.css";
import { AuthContext } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { user, logoutUser } = auth;

  const username = user ? `${user.first_name} ${user.last_name}` : "";

  // State for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to Toggle Theme
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.setAttribute("data-theme", "light");
    } else {
      htmlElement.setAttribute("data-theme", "dark");
    }
  };

  return (
    <nav className="navbar">
      <div className="side-brand">
        <Link to="/landing" className="navbar-brand">
          Intelljob
        </Link>
      </div>
      <div className="navbar-list" id="navbarSupportedContent">
        <ul className="nav-list ml-auto">
          {/* Dark Mode Toggle Button */}
          <li>
            <button
              onClick={toggleTheme}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--theme-color-3)",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
              }}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <i className="bx bx-sun"></i> // Light mode icon
              ) : (
                <i className="bx bx-moon"></i> // Dark mode icon
              )}
            </button>
          </li>

          {/* Navigation Links */}
          <li>
            <Link to="/about-us" className="nav-link">
              About us
            </Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/signup" className="nav-link">
                  Sign up
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="username">{username}</li>
              <li>
                <button
                  onClick={logoutUser}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "var(--theme-color-3)",
                    cursor: "pointer",
                  }}
                >
                  <i className="bx bx-log-out"></i>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
