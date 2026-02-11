export default function DashboardLayout({ children }) {
  return (
    <div style={container}>
      <header style={header}>
        <h1 style={{ margin: 0 }}>Toomaga Payment System</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}

const container = {
  background: "#f4f6fb",
  minHeight: "100vh",
  padding: "40px",
  fontFamily: "Inter, sans-serif",
};

const header = {
  marginBottom: "30px",
};
