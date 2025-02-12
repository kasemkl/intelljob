export const lightTheme = {
  colors: {
    // Background colors
    background: {
      primary: "#FFFFFF", // Main background (navbar, sidebar)
      secondary: "#F8F9FA", // Secondary background (cards, sections)
      tertiary: "#121212", // Content area background
      hover: "#f0f0f0",
    },

    // Text colors
    text: {
      primary: "#121212", // Main text on light backgrounds
      secondary: "#FFFFFF", // Main text on dark backgrounds
      muted: "#6C757D", // Secondary text
      accent: "#0D6EFD", // Highlighted text
      hover: "#0D6EFD",
    },

    // Border colors
    border: {
      light: "#DEE2E6",
      medium: "#CED4DA",
      dark: "#343A40",
    },

    // Button colors
    button: {
      primary: "#0D6EFD",
      hover: "#0B5ED7",
      text: "#FFFFFF",
    },

    // Status colors
    status: {
      success: "#198754",
      error: "#DC3545",
      warning: "#FFC107",
      info: "#0DCAF0",
    },

    // Form colors
    form: {
      background: "#FFFFFF",
      border: "#CED4DA",
      focus: "#0D6EFD",
    },
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  },

  // Border radius
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
  },
};

export const darkTheme = {
  colors: {
    // Background colors
    background: {
      primary: "#121212", // Main background
      secondary: "#1E1E1E", // Secondary background
      tertiary: "#2D2D2D", // Content area background
      hover: "#2D2D2D",
    },

    // Text colors
    text: {
      primary: "#FFFFFF", // Main text
      secondary: "#E0E0E0", // Secondary text
      muted: "#A0A0A0", // Muted text
      accent: "#4D94FF", // Highlighted text
      hover: "#4D94FF",
    },

    // Border colors
    border: {
      light: "#404040",
      medium: "#505050",
      dark: "#606060",
    },

    // Button colors
    button: {
      primary: "#4D94FF",
      hover: "#3D84FF",
      text: "#FFFFFF",
    },

    // Status colors
    status: {
      success: "#00C853",
      error: "#FF1744",
      warning: "#FFD600",
      info: "#00B0FF",
    },

    // Form colors
    form: {
      background: "#2D2D2D",
      border: "#404040",
      focus: "#4D94FF",
    },
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.2)",
    md: "0 4px 6px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.4)",
  },

  // Border radius
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
  },
};

export type Theme = typeof lightTheme;
