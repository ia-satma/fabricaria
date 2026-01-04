
import os

# CONSTANTES DE NEGOCIO (Step 114) - Precios por 1M tokens o uso horario
# Gemini 1.5 Pro Context Caching: ~$4.50/hr (mantenimiento)
# Gemini standard input: ~$0.50 / 1M tokens
# Gemini cache input: ~$0.20 / 1M tokens (50% cheaper)

COST_STORE_HR = 4.50  # USD/hour for maintaining the cache
COST_STD_INPUT = 0.50 # USD / 1M tokens
COST_CACHE_IN = 0.20  # USD / 1M tokens

def calculate_break_even():
    """
    Calcula N_eq: Frecuencia de consultas necesaria para que el caché sea rentable.
    Formula: N_eq = Costo_Mantenimiento / (Ahorro_por_Consulta)
    """
    savings_per_query_unit = (COST_STD_INPUT - COST_CACHE_IN)
    # Suponiendo consultas promedio de 100k tokens (0.1M units)
    savings_per_100k_query = savings_per_query_unit * 0.1
    
    n_eq = COST_STORE_HR / savings_per_100k_query
    return n_eq # Result is queries per hour

def should_cache(session_velocity: float) -> bool:
    """
    session_velocity: Consultas por hora (q/hr)
    """
    n_eq = calculate_break_even() # Aprox 2.5 - 5 q/hr dependiendo del tamaño del prompt
    print(f"📊 [FinOps] Break-even velocity: {n_eq:.2f} q/hr. Current: {session_velocity:.2f} q/hr")
    
    return session_velocity > n_eq

if __name__ == "__main__":
    # Test
    vel = 3.0
    result = should_cache(vel)
    print(f"Decisión para {vel} q/hr: {'CACHING' if result else 'RAG (Neon)'}")
