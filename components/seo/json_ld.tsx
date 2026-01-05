
import React from 'react';

/**
 * PASO 378: INYECCIÓN DE JSON-LD (Schema.org)
 * Objetivo: Explicar el contenido a Google en su propio lenguaje.
 */

interface JsonLdProps {
    data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// Ejemplo de uso para Organización
export const OrganizationJsonLd = () => (
    <JsonLd
        data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Fabricaria",
            "url": "https://fabricaria.vercel.app",
            "logo": "https://fabricaria.vercel.app/logo.png",
            "description": "Soberanía de Fabricación Agéntica y Automatización Industrial.",
        }}
    />
);
