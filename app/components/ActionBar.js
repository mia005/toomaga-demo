export default function ActionBar({ toggleTheme, darkMode }) {
  return (
    <div style={{ marginTop: "30px", marginBottom: "20px" }}>
      <button onClick={toggleTheme}>
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
