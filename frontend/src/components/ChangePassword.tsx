import React, { useContext, useState } from "react";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import useAxios from "../hooks/useAxios";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const api = useAxios();
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { user } = auth;

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await api.put(
        `/api/users-management/users/change-password/${user.user_id}/`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      );

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Error changing password");
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="change-password-section">
      <h5>Change Password</h5>
      <MDBInput
        type="password"
        label="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="mb-3"
      />
      <MDBInput
        type="password"
        label="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="mb-3"
      />
      <MDBInput
        type="password"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mb-3"
      />
      <MDBBtn color="primary" onClick={handleChangePassword}>
        Change Password
      </MDBBtn>
    </div>
  );
};

export default ChangePassword;
