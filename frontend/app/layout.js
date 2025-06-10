import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./AuthContext"; // Import the AuthProvider
import Header from "./components/Header"; // Import the new Header component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dropship Hunter",
  description: "Find trending dropshipping products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Wrap everything with AuthProvider */}
          <Header /> {/* Add the Header to every page */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}