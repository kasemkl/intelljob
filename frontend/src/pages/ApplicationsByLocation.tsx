import React, { useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import LocationSearch from "../components/LocationSearch";
import ApplicationList from "../components/ApplicationList";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

const ApplicationsByLocation: React.FC = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const [loading, setLoading] = useState;

  //make useEffect
  const handleSearch = async (
    city: string,
    country: string,
    radius: number
  ) => {
    try {
      setError(null);
      const response = await api.get("/applications/by-location", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          city,
          country,
          radius,
        },
      });

      setApplications(response.data);
    } catch (err) {
      setError("Failed to fetch applications. Please try again.");
      console.error("Error fetching applications:", err);
    } finally {
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Applications by Location
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <LocationSearch onSearch={handleSearch} />
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <ApplicationList applications={applications} />
    </Box>
  );
};

export default ApplicationsByLocation;
