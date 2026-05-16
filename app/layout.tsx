import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HirePilot AI | AI-Powered Interview Preparation Platform",
    template: "%s | HirePilot AI",
  },
  description:
    "A premium AI SaaS platform for resume analysis, interview questions, HR preparation, and skill gap insights.",
  keywords: [
    "HirePilot AI",
    "AI interview preparation",
    "resume analysis",
    "technical interview questions",
    "HR interview preparation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
