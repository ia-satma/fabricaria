
/**
 * AEGIS SECURITY INTERCEPTOR
 * Protocolo de validación para prevenir inyecciones y fugas de datos.
 */

export function validateArtifact(data: any): boolean {
    if (!data || typeof data !== 'object') {
        throw new Error("BLOQUEO DE SEGURIDAD AEGIS: Artefacto nulo o inválido.");
    }

    // 1. Verificación de Inyección de Comandos (Pattern Matching)
    const dangerousPatterns = [
        /rm\s+-rf/i,
        /drop\s+table/i,
        /delete\s+from/i,
        /truncate\s+table/i,
        /system\(/i,
        /exec\(/i,
        /\/etc\/passwd/i,
        /\/etc\/shadow/i
    ];

    const contentStr = JSON.stringify(data).toLowerCase();

    for (const pattern of dangerousPatterns) {
        if (pattern.test(contentStr)) {
            console.error(`🚨 ALERTA AEGIS: Patrón peligroso detectado -> ${pattern}`);
            throw new Error("BLOQUEO DE SEGURIDAD AEGIS: Comando peligroso detectado.");
        }
    }

    // 2. Verificación de Fuga de Secretos (Simulada para Regex común)
    // Busca patrones tipo "sk-..." (OpenAI) o "AIza..." (Google)
    // Nota: Esto es heurístico y básico.
    const secretPatterns = [
        /sk-[a-zA-Z0-9]{32,}/, // OpenAI-ish
        /AIza[a-zA-Z0-9_\-]{35}/, // Google-ish
    ];

    for (const pattern of secretPatterns) {
        if (pattern.test(JSON.stringify(data))) {
            console.error(`🚨 ALERTA AEGIS: Posible filtración de credencial detectada.`);
            throw new Error("BLOQUEO DE SEGURIDAD AEGIS: Posible filtración de credenciales.");
        }
    }

    // 3. Validación de Estructura Mínima
    if (!data.id || !data.type || !data.content) {
        throw new Error("BLOQUEO DE SEGURIDAD AEGIS: El artefacto no cumple con la estructura requerida (id, type, content).");
    }

    return true; // Aprobado
}
