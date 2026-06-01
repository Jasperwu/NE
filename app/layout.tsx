import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Narrative Excellence — Tailor your message",
  description:
    "Tailor your presentation to your audience, sharpen your purpose, and structure a narrative that moves people from A to B.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
