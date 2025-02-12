import React, { useState } from "react";
import Profile from "../components/Profile";
import PersonalInfo from "../components/PersonalInfo";
import ChangePassword from "../components/ChangePassword";
import { MDBFile, MDBBtn } from "mdb-react-ui-kit";
import useAxios from "../hooks/useAxios";
import { toast } from "react-toastify";

const Settings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const api = useAxios();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", userDetails.first_name);
      formData.append("last_name", userDetails.last_name);
      formData.append("email", userDetails.email);
      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      await api.put("/api/users-management/users/me/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Profile Settings</h1>
      <div className="profile-section">
        <h5>Profile Picture</h5>
        {isEditing ? (
          <MDBFile
            label="Choose a profile picture"
            onChange={handleFileChange}
          />
        ) : (
          <img
            src={
              profilePicture
                ? URL.createObjectURL(profilePicture)
                : "/default-profile.png"
            }
            alt="Profile"
            className="profile-picture"
          />
        )}
      </div>
      <PersonalInfo
        userDetails={userDetails}
        isEditing={isEditing}
        onInputChange={handleInputChange}
      />
      <ChangePassword />
      <MDBBtn
        color={isEditing ? "danger" : "primary"}
        onClick={() => setIsEditing(!isEditing)}
        className="me-2"
      >
        {isEditing ? "Cancel" : "Edit Profile"}
      </MDBBtn>
      {isEditing && (
        <MDBBtn color="success" onClick={handleSave}>
          Save Changes
        </MDBBtn>
      )}
    </div>
  );
};

export default Settings;
