import "./globals.css";

export const metadata = {
  title: "Toomaga Payment System",
  description: "Loan Management Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
