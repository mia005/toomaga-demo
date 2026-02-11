import "./globals.css";

export const metadata = {
  title: "Toomaga Payment System",
  description: "Live Demo"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
