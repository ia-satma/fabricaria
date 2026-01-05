import { getDashboardStats, getUsers } from "@/app/actions/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Database, Brain, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Dashboard | Fabricaria",
        description: "Panel central de control y métricas del enjambre agéntico.",
        openGraph: {
            images: [`/api/og?title=Dashboard`],
        },
    };
}

export default async function DashboardPage() {
    const statsResult = await getDashboardStats();
    const usersResult = await getUsers();

    const stats = statsResult.success ? statsResult.data : null;
    const users = usersResult.success ? usersResult.data : [];

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b">
                <div className="container flex h-16 items-center px-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="ml-auto">
                        <Link href="/">
                            <Button variant="ghost">← Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container py-8 px-4">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.activeUsers || 0} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tenants</CardTitle>
                            <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalTenants || 0}</div>
                            <p className="text-xs text-muted-foreground">Organizations</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Agent Memories</CardTitle>
                            <Brain className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalMemories || 0}</div>
                            <p className="text-xs text-muted-foreground">Vector embeddings</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Online</div>
                            <p className="text-xs text-muted-foreground">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!users || users.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No users found. Database is empty.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2 font-medium">ID</th>
                                            <th className="text-left p-2 font-medium">Name</th>
                                            <th className="text-left p-2 font-medium">Email</th>
                                            <th className="text-left p-2 font-medium">Tenant</th>
                                            <th className="text-left p-2 font-medium">Status</th>
                                            <th className="text-left p-2 font-medium">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b hover:bg-muted/50">
                                                <td className="p-2 font-mono text-sm">{user.id}</td>
                                                <td className="p-2">{user.name || "—"}</td>
                                                <td className="p-2">{user.email}</td>
                                                <td className="p-2">{user.tenantName || "—"}</td>
                                                <td className="p-2">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {user.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-sm text-muted-foreground">
                                                    {user.createdAt
                                                        ? new Date(user.createdAt).toLocaleDateString()
                                                        : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
