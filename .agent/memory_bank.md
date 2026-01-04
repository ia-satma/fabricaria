
# 🧠 Error Memory Bank (Lecciones Aprendidas)

Este archivo es la "Memoria Tribal" de la Pentarquía. Los agentes deben consultar esto antes de iniciar cualquier tarea para evitar repetir errores históricos.

## Lecciones Críticas
- **Next.js 14**: No usar `useRouter` en componentes marcados como Server Components.
- **Neon Postgres**: Los vectores de `pgvector` requieren un cast explícito `::vector` en consultas SQL brutas.
- **Security**: NUNCA hardcodear API Keys, incluso en archivos temporales de test.
- **FSD Architecture**: Mantener la lógica de negocio en `features/`, no en `components/`.

## Registro de Fallos Recientes
- [2026-01-04]: Error de sintaxis en `ts-morph` por confusión entre `getName()` y `getNameNode()`. Solucionado usando cast `(attr as any).getName()`.
