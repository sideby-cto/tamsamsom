import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sideby market map",
  description: "Interactive TAM, SAM, and SOM visualization for sideby.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
