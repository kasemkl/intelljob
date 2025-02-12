import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {isDarkMode ? "Light" : "Dark"} Mode
    </button>
  );
};
