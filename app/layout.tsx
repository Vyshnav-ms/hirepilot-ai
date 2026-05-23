import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HirePilot AI | AI-Powered Interview Preparation Platform",
    template: "%s | HirePilot AI",
  },
  description:
    "Generate personalized interview questions and measure your ATS score by matching your resume against job descriptions — powered by real AI.",
  keywords: [
    "HirePilot AI",
    "AI interview preparation",
    "ATS score checker",
    "resume JD matching",
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
