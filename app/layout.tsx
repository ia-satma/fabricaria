import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Fabricaria Dashboard",
    description: "Sistema de gestión Fabricaria",
};

import { AppShell } from "@/components/layout/app-shell";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
            <body className="antialiased font-sans">
                <SidebarProvider>
                    <AppShell>{children}</AppShell>
                </SidebarProvider>
            </body>
        </html>
    );
}
