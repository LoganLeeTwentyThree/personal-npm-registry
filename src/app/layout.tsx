import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
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
      <body className="bg-black w-screen h-screen">
        <Auth0Provider>
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}