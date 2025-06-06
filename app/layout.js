import { PhukienProvider } from "./context/PhukienContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import SerchAppBar from "./appBar";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bodyds">

        {/* Bọc toàn bộ ứng dụng trong Provider */}
        <PhukienProvider>
          <SerchAppBar />
          {children}
        </PhukienProvider>
      </body>
    </html>
  );
}
