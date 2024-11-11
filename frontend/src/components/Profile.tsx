import React, { useContext, useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import "../styles/settings.css";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

interface UserInfo {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_photo?: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  profile_photo: File | null;
}

interface Passwords {
  old_password: string;
  new_password: string;
  confirmation_password: string;
}

const Profile: React.FC = () => {
  const api = useAxios();
  const auth = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    profile_photo: null,
  });

  const [passwords, setPasswords] = useState<Passwords>({
    old_password: "",
    new_password: "",
    confirmation_password: "",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!auth?.user?.id) return;

        const response = await api.get(
          `/api/users-management/users/${auth.user.id}/`
        );

        if (response.status === 200) {
          setUserInfo(response.data);
          setFormData({
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            email: response.data.email,
            profile_photo: null,
          });
          setImageSrc(response.data.profile_photo || "");
        }
      } catch (error) {
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [api, auth?.user?.id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/jpeg") {
      toast.error("Only JPEG files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({
      ...prev,
      profile_photo: file,
    }));
  };

  const validateName = (name: string): boolean => {
    return /^[a-zA-Z]+$/.test(name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "first_name" || name === "last_name") {
      if (!validateName(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only letters are allowed",
        }));
        return;
      }
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isStrongPassword = () => {
    const hasLetter = /[a-zA-Z]/.test(passwords.new_password);
    const hasDigit = /\d/.test(passwords.new_password);
    return passwords.new_password.length > 7 && hasLetter && hasDigit;
  };

  const isPasswordMatch = () => {
    return (
      passwords.new_password &&
      passwords.confirmation_password &&
      passwords.new_password === passwords.confirmation_password
    );
  };

  const handleUpdateUserInfo = async () => {
    if (errors.first_name || errors.last_name) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await api.put(
        `/api/users-management/users/${auth.user.id}/`,
        formDataToSend
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  };

  const handleUpdatePassword = async () => {
    if (!isStrongPassword() || !isPasswordMatch()) {
      toast.error("Password must be strong and match the confirmation");
      return;
    }
    try {
      const response = await api.put(`user-password`, passwords);
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.detail);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.detail);
    }
  };

  return (
    <div className="profile">
      <div className="container">
        {!userInfo ? (
          <p>loading info....</p>
        ) : (
          <div className="row gutters">
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="card h-100">
                <div className="card-body">
                  <div className="account-settings">
                    <div className="user-profile">
                      <div className="user-avatar">
                        <img
                          src={imageSrc}
                          alt="..."
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
                      <h5 className="user-name">
                        {formData.first_name + " " + formData.last_name}
                      </h5>
                      <h6 className="user-email">{formData.email}</h6>
                    </div>
                    <div className="about">
                      <h5>About</h5>
                      <p>
                        {userInfo.role === "job_seeker"
                          ? "JOB SEEKER"
                          : "COMPANY"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
              <div className="card h-100">
                <div className="card-body">
                  <form>
                    <div className="row gutters">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <h6 className="mb-2 text-primary">Personal Details</h6>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label htmlFor="first_name">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            placeholder="Enter first name"
                            onChange={handleInputChange}
                            value={formData.first_name}
                          />
                          {errors.first_name && (
                            <p className="error">{errors.first_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label htmlFor="last_name">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            name="last_name"
                            placeholder="Enter last name"
                            onChange={handleInputChange}
                            value={formData.last_name}
                          />
                          {errors.last_name && (
                            <p className="error">{errors.last_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label htmlFor="eMail">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="eMail"
                            name="email"
                            placeholder="Enter email ID"
                            onChange={handleInputChange}
                            value={formData.email}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row gutters">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <h6 className="mt-3 mb-2 text-primary">Password</h6>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                        <div className="form-group">
                          <label htmlFor="old_password">Old Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="old_password"
                            name="old_password"
                            onChange={handlePasswordChange}
                            value={passwords.old_password}
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                        <div className="form-group">
                          <label htmlFor="new_password">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="new_password"
                            name="new_password"
                            onChange={handlePasswordChange}
                            value={passwords.new_password}
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                        <div className="form-group">
                          <label htmlFor="confirmation_password">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirmation_password"
                            name="confirmation_password"
                            onChange={handlePasswordChange}
                            value={passwords.confirmation_password}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row gutters">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleUpdateUserInfo}
                        >
                          Update Profile
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleUpdatePassword}
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
