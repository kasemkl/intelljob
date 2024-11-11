import { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import apiClient from "../services/apiClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await apiClient.post("/api/auth/register", { email, password });
      console.log("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4">Register</Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleRegister}
        fullWidth
        sx={{ mt: 2 }}
      >
        Register
      </Button>
    </Box>
  );
};

export default Register;
