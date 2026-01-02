import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Fabricaria Dashboard",
    description: "Sistema de gestión Fabricaria",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased">{children}</body>
        </html>
    );
}
