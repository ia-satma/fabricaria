import type { Metadata } from "next";
import "./globals.css";

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
        <html lang="es">
            <body className="antialiased font-sans">
                <SidebarProvider>
                    <AppShell>{children}</AppShell>
                </SidebarProvider>
            </body>
        </html>
    );
}
