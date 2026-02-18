import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "personal-npm-registry",
  description: "My very own registry for npm packages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black w-screen h-screen m-0 overflow-hidden">
          {children}
      </body>
    </html>
  );
}