import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Box, Typography } from "@mui/material";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Splajompy",
  description: "A work in progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box
              component="header"
              sx={{
                position: "fixed",
                top: 0,
                width: "100%",
                height: "60px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
                zIndex: 1100,
                borderBottom: "0.5px solid rgba(160, 160, 160, 0.3)",
              }}
            >
              <Typography variant="h5" fontWeight={700}>
                Splajompy
              </Typography>
            </Box>
            <InitColorSchemeScript attribute="class" />
            <Box component="main" sx={{ paddingTop: "80px" }}>
              {children}
            </Box>

            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
