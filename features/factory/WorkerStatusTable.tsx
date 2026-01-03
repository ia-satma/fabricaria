import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Worker {
    id: string;
    name: string;
    role: string;
    status: 'running' | 'idle' | 'error';
    outputPerHour: number;
    lastHeartbeat: Date;
}

interface WorkerStatusTableProps {
    workers: Worker[];
}

function getStatusBadge(status: Worker['status']) {
    switch (status) {
        case 'running':
            return <Badge variant="success">Running</Badge>;
        case 'idle':
            return <Badge variant="secondary">Idle</Badge>;
        case 'error':
            return <Badge variant="destructive">Error</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

function formatHeartbeat(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) {
        return 'Just now';
    }
    
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) {
        return `${diffMins}m ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
}

export function WorkerStatusTable({ workers }: WorkerStatusTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Worker Status</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Output/Hour</TableHead>
                            <TableHead className="text-right">Last Heartbeat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workers.map((worker) => (
                            <TableRow key={worker.id}>
                                <TableCell className="font-medium">{worker.name}</TableCell>
                                <TableCell>{worker.role}</TableCell>
                                <TableCell>{getStatusBadge(worker.status)}</TableCell>
                                <TableCell className="text-right">{worker.outputPerHour}</TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {formatHeartbeat(worker.lastHeartbeat)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
