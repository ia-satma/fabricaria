#!/bin/bash
# PASO 219: THE VAULT BRIDGE (Migración de Secretos)
# Objetivo: Sincronizar .env de Replit a Vercel CLI.

if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI no está instalado. Ejecuta: npm i -g vercel"
    exit 1
fi

echo "🔐 [Vault-Bridge] Sincronizando secretos con Vercel..."

# Leer .env y agregar cada variable a Vercel
while IFS='=' read -r key value
do
    # Ignorar líneas vacías y comentarios
    if [[ ! -z "$key" && "$key" != \#* ]]; then
        echo "📤 Agregando $key..."
        # Eliminar posibles comillas del valor
        clean_value=$(echo "$value" | sed 's/^"//;s/"$//')
        # Agregar a Vercel para todos los entornos (production, preview, development)
        echo "$clean_value" | vercel env add "$key" production preview development --force
    fi
done < .env

echo "✅ [Vault-Bridge] Sincronización completada. Verifica en el dashboard de Vercel."
