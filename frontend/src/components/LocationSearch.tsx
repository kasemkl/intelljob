import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

interface LocationSearchProps {
  onSearch: (city: string, country: string, radius: number) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [radius, setRadius] = useState(50);

  const handleSearch = () => {
    onSearch(city, country, radius);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
      <TextField
        label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        size="small"
      />
      <TextField
        label="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        size="small"
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Radius (km)</InputLabel>
        <Select
          value={radius}
          label="Radius (km)"
          onChange={(e) => setRadius(Number(e.target.value))}
        >
          <MenuItem value={10}>10 km</MenuItem>
          <MenuItem value={25}>25 km</MenuItem>
          <MenuItem value={50}>50 km</MenuItem>
          <MenuItem value={100}>100 km</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
};

export default LocationSearch;
