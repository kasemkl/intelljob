import React, { useContext, useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import defaultPhotoUrl from "../../assets/default_profile_photo.jpg";
import "../../styles/form.css";
import "../../styles/sign_up.css";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  password: string;
  confirmation_password: string;
  profile_photo: File | null;
  role: string;
}

const Signup: React.FC = () => {
  const { registerUser, loginUser } = useContext(AuthContext) || {};
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    password: "",
    confirmation_password: "",
    profile_photo: null,
    role: "",
  });

  const [imageSrc, setImageSrc] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    first_name: string;
    last_name: string;
  }>({
    first_name: "",
    last_name: "",
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    const updatedFormData = { ...formData, [name]: files ? files[0] : value };

    if (name === "first_name" || name === "last_name") {
      if (!/^[a-zA-Z]*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only letters are allowed",
        }));
        return;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }

    setFormData(updatedFormData);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type !== "image/jpeg") {
      toast.error("Only JPEG files are allowed.");
      return;
    }
    const reader = new FileReader();

    reader.onload = function (e) {
      setImageSrc(e.target?.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
      setFormData({
        ...formData,
        profile_photo: file,
      });
    }
  };

  const isStrong = () => {
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasDigit = /\d/.test(formData.password);
    return formData.password.length > 7 && hasLetter && hasDigit;
  };

  const isMatch = () => {
    return (
      formData.password &&
      formData.confirmation_password &&
      formData.password === formData.confirmation_password
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate that required fields are not empty
    if (
      !formData.email ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.password ||
      !formData.date_of_birth ||
      !formData.role
    ) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser(formData);
      if (response instanceof Error) {
        throw response;
      }

      const data = await response.json();
      if (response.status === 201) {
        toast.success("Registration successful!");
        if (loginUser) {
          loginUser(formData);
        }
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration");
    }
    setLoading(false);
  };

  return (
    <div className="Form">
      <form className="sign-up" onSubmit={handleSubmit}>
        <fieldset>
          <span className="title">Sign Up</span>

          <div className="avatar avatar-xl">
            <img
              src={imageSrc ? imageSrc : defaultPhotoUrl}
              alt="Profile"
              className="avatar-img rounded-circle"
            />
            <div className="change-photo">
              <label className="" htmlFor="customFile">
                Change Photo
              </label>
              <input
                type="file"
                className="form-control d-none"
                id="customFile"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your Email..."
              value={formData.email}
              onChange={handleInputChange}
            />
            <i className="bx bxs-id-card"></i>
          </div>

          <div className="field">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter your first name..."
              value={formData.first_name}
              onChange={handleInputChange}
            />
            {errors.first_name && (
              <p className="error ml-70" style={{ marginLeft: "25%" }}>
                {errors.first_name}
              </p>
            )}
            <i className="bx bxs-user-detail"></i>
          </div>

          <div className="field">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter your last name..."
              value={formData.last_name}
              onChange={handleInputChange}
            />
            {errors.last_name && (
              <p className="error" style={{ marginLeft: "25%" }}>
                {errors.last_name}
              </p>
            )}
            <i className="bx bxs-user-detail"></i>
          </div>
          <div className="field">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              style={{ color: "var(--color-grey-600) !important" }}
            >
              <option value="">Select a role...</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="company">Company</option>
            </select>
            <i className="bx bx-user-pin"></i>
          </div>

          <div className="field">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              placeholder="Enter your birth date..."
              value={formData.date_of_birth}
              onChange={handleInputChange}
            />
            <i className="bx bx-calendar"></i>
          </div>

          <div className="field">
            <label>Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter the password..."
              value={formData.password}
              onChange={handleInputChange}
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
          {!isStrong() && formData.password && (
            <p className="error">Password is not strong enough</p>
          )}

          <div className="field">
            <label>Confirmation Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmation_password"
              placeholder="Enter confirmation password..."
              value={formData.confirmation_password}
              onChange={handleInputChange}
            />
            <i className="bx bx-lock-alt"></i>
          </div>
          {!isMatch() && formData.confirmation_password && (
            <p className="error">Confirmation password does not match</p>
          )}

          <div className="field button sign">
            {loading ? (
              <button className="btn loading-btn" disabled>
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className="btn"
                disabled={!isStrong() || !isMatch()}
              >
                Sign up
              </button>
            )}
          </div>
          <div className="login-signup">
            <span className="text">
              Already a member?
              <Link to="/login" className="text login-link">
                Login Now
              </Link>
            </span>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Signup;
