import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import { ToastContainer } from 'react-toastify';
import { Suspense } from "react";
import ResponsiveDrawer from "../common/ResponsiveDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function DashboardLayout({ children }) {
  return (
    
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <Suspense fallback={<p>Loading...</p>}>

            <ResponsiveDrawer>{children}</ResponsiveDrawer>

            </Suspense>
      </body>

  );
}
