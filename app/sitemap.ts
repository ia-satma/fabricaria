
import { MetadataRoute } from 'next';

/**
 * PASO 375: MAPA DEL SITIO (SITEMAP.XML) AUTO-GENERADO
 * Objetivo: Que los buscadores encuentren todas las rutas, incluso las dinámicas.
 */

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fabricaria.vercel.app';

    // Rutas estáticas
    const routes = [
        '',
        '/dashboard',
        '/analytics',
        '/settings',
        '/auth/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // En una fase posterior, aquí se consultarían IDs de la base de datos para rutas dinámicas
    // const dynamicRoutes = projects.map(p => ({ url: `${baseUrl}/projects/${p.id}`, ... }));

    return [...routes];
}
