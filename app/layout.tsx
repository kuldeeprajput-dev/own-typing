import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { KeyboardSettingsProvider } from "@/context/KeyboardSettingsContext";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OwnType",
  description: "A high-performance typing test",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/own-type-icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/own-type-favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full overflow-hidden antialiased`}>
      <body className="h-full overflow-hidden flex flex-col bg-[#0f0f0f] font-mono">
        <KeyboardSettingsProvider>
          {children}
        </KeyboardSettingsProvider>
      </body>
    </html>
  );
}
