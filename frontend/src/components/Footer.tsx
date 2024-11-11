import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: "auto",
        bgcolor: "grey.800",
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography variant="body1">
        © {new Date().getFullYear()} IntelliJob. All rights reserved.
      </Typography>
      <Typography variant="body2">
        Built with ❤️ using React and TypeScript
      </Typography>
    </Box>
  );
};

export default Footer;
