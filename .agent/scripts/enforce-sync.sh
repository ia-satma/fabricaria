#!/bin/bash

# PASO 401: AGENTE "GIT-ENFORCER"
# Objetivo: Forzar la verdad de GitHub sobre el estado local de Replit.

echo "👮‍♂️ [Git-Enforcer] Iniciando protocolo de sincronización forzada..."

# Asegurar que estamos en la rama correcta
git checkout main

# Intentar pull con rebase
echo "📥 [Git-Enforcer] Ejecutando: git pull --rebase origin main"
git pull --rebase origin main

if [ $? -ne 0 ]; then
    echo "⚠️ [Git-Enforcer] Conflicto de fusión detectado. Aplicando regla de oro: GITHUB PREVALECE."
    # Abortar el rebase fallido si es necesario
    git rebase --abort 2>/dev/null
    
    # Forzar la versión remota sobre la local
    echo "⚔️ [Git-Enforcer] Ejecutando: git fetch origin main && git reset --hard origin/main"
    git fetch origin main
    git reset --hard origin/main
    
    echo "✅ [Git-Enforcer] Estado local sobrescrito con la verdad de GitHub."
else
    echo "✅ [Git-Enforcer] Sincronización limpia completada."
fi

echo "🚀 [Git-Enforcer] Sistema listo para la siguiente fase."
