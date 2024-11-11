import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/nav.css";
import { AuthContext } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { user, logoutUser } = auth;

  const username = user ? `${user.first_name} ${user.last_name}` : "";

  return (
    <nav className="navbar">
      <div className="side-brand">
        <Link to="/" className="navbar-brand">
          Intelljob
        </Link>
      </div>
      <div className="navbar-list" id="navbarSupportedContent">
        <ul className="nav-list ml-auto">
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
