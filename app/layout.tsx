import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ExpenseProvider } from "../contexts/ExpenseContext";
import { ThemeProvider } from "../components/expensi/ThemeProvider";
import { ToastProvider } from "../components/expensi/ToastProvider";

export const metadata: Metadata = {
  title: "Expensi - Split Bills & Track Expenses",
  description: "Easily split bills, track expenses, and settle up with friends, roommates, and groups.",
  keywords: ["expense tracker", "bill splitting", "splitwise alternative", "group expenses", "shared bills"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1D9C5A" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <ExpenseProvider>
                {children}
              </ExpenseProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
