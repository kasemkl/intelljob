import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
      light: "#e0e0e0",
      dark: "#cccccc",
    },
    secondary: {
      main: "#666666",
      light: "#999999",
      dark: "#333333",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#e0e0e0",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          backgroundColor: "#333333",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#666666",
          },
        },
        outlined: {
          borderColor: "#666666",
          color: "#ffffff",
          "&:hover": {
            borderColor: "#999999",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
        },
      },
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    allVariants: {
      color: "#ffffff",
    },
  },
});

export default theme;
