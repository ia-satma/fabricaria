
import { ImageResponse } from 'next/og';
// App router includes @vercel/og by default in ImageResponse

/**
 * PASO 376: OPEN GRAPH GENERATIVO (OG Images)
 * Objetivo: Generar imágenes personalizadas al vuelo para redes sociales.
 */

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?title=<title>
        const title = searchParams.get('title') || 'Fabricaria Dashboard';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000',
                        backgroundImage: 'radial-gradient(circle at 25% 25%, #001f3f 0%, #000 100%)',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: 40,
                            left: 40,
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ width: 40, height: 40, background: '#00f0ff', borderRadius: 8 }} />
                        <span style={{ marginLeft: 12, fontSize: 24, color: '#fff', fontWeight: 'bold' }}>
                            FABRICAR.IA
                        </span>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '0 80px',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: 60,
                                fontWeight: 800,
                                color: '#fff',
                                marginBottom: 20,
                                letterSpacing: '-0.025em',
                                textShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                            }}
                        >
                            {title}
                        </h1>
                        <p style={{ fontSize: 30, color: '#00f0ff', opacity: 0.8 }}>
                            Soberanía de Fabricación Agéntica
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            bottom: 40,
                            right: 40,
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: 16,
                        }}
                    >
                        v51.0.0 // Operational Singularity
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
