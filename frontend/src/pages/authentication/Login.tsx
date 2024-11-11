import React, { useContext, useState, FormEvent } from "react";
import "../../styles/form.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { MDBSpinner } from "mdb-react-ui-kit";
import Modal from "../../ui/Modal";

interface ModalText {
  title: string;
  body: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { loginUser } = useContext(AuthContext) || {}; // Use optional chaining
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<ModalText>({
    title: "Login",
    body: "",
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setModalText({ ...modalText, body: "A field is missing" });
      setShowModal(true);
      return;
    }
    if (!loginUser) {
      setModalText({
        title: "Error",
        body: "Authentication service unavailable",
      });
      setShowModal(true);
      return;
    }
    setLoading(true);
    const formData = { email, password };

    const response = await loginUser(formData);
    setLoading(false);
    if (response.status !== 200) {
      console.log(response.data);
      setShowModal(true);
      setModalText({ title: "Login Failed", body: response.data.detail });
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          text={modalText}
          onHide={() => {
            setShowModal(false);
            setModalText({ title: "Login", body: "" });
          }}
        />
      )}
      <div className="Form">
        <form onSubmit={handleLogin} className="login">
          <fieldset>
            <span className="title">Log in</span>
            <div className="field">
              <label>
                Email <sup></sup>
              </label>
              <input
                type="email"
                placeholder="Type your Email..."
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-id-card"></i>
            </div>
            <div className="field">
              <label>Password </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Type your password..."
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bx-lock-alt"></i>
              <div className="show-hide" onClick={handleTogglePassword}>
                {showPassword ? (
                  <i className="bx bx-hide"></i>
                ) : (
                  <i className="bx bx-show"></i>
                )}
              </div>
            </div>
            <div className="field button">
              {loading ? (
                <button className="btn loading-btn" disabled>
                  <MDBSpinner
                    size="md"
                    role="status"
                    tag="span"
                    className="me-2"
                  />
                  Loading...
                </button>
              ) : (
                <button type="submit" className="btn">
                  Login
                </button>
              )}
            </div>
            <div className="login-signup">
              <span className="text">
                Not a member?
                <Link to="/sign-up" className="text login-link">
                  Sign Up Now
                </Link>
              </span>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default Login;
