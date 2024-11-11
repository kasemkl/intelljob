import { useAuth } from "../hooks/useAuth";
import { Box, Typography } from "@mui/material";

const Profile = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 400 }}>
      <Typography variant="h4">Profile</Typography>
      {user ? (
        <Typography variant="body1">Welcome, {user.email}</Typography>
      ) : (
        <Typography variant="body1">
          Please log in to see your profile.
        </Typography>
      )}
    </Box>
  );
};

export default Profile;
