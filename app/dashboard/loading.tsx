
import { Skeleton } from "@/components/ui/skeleton";

/**
 * PASO 313: ESTADOS DE CARGA "SKELETON" (UX Optimista)
 * Objetivo: Evitar Layout Shift y mejorar percepción de snappiness.
 */

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 w-full p-6 cyber-card animate-pulse-slow">
                        <Skeleton className="h-4 w-1/2 mb-4 bg-primary/10" />
                        <Skeleton className="h-8 w-3/4 bg-primary/20" />
                    </div>
                ))}
            </div>
            <div className="h-96 w-full cyber-card animate-pulse-slow">
                <Skeleton className="h-full w-full bg-primary/5" />
            </div>
        </div>
    );
}
