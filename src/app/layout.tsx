import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { Box } from "@mui/material";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import PlausibleProvider from "next-plausible";
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
      <head>
        <PlausibleProvider
          domain="splajompy.com"
          customDomain="https://analytics.splajompy.com"
          selfHosted
        />
      </head>
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ReactQueryProvider>
              <InitColorSchemeScript attribute="class" />
              <Box component="main" sx={{ paddingTop: "60px" }}>
                {children}
              </Box>
            </ReactQueryProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
