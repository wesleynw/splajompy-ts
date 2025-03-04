import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers";
import { ReactQueryProvider } from "./providers/ReacyQueryProvider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Splajompy",
  description: "One of the websites of all time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable}>
        <ReactQueryProvider>
          <PostHogProvider>
            <div className="mb-16">{children}</div>
          </PostHogProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
