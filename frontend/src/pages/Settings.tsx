import React from "react";
import Profile from "../components/Profile";

const Settings: React.FC = () => {
  return (
    <div className="settings-container">
      <h1 className="settings-title">Profile Settings</h1>
      <Profile />
    </div>
  );
};

export default Settings;
