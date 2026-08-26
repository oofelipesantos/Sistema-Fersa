import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Fersa Support", template: "%s | Fersa Support" },
  description: "Multilingual technical after-sales support platform.",
  applicationName: "Fersa Support",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Fersa" }
};

export const viewport: Viewport = { themeColor: "#09233b" };

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <html suppressHydrationWarning>{children}</html>;
}
