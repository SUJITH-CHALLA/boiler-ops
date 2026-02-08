
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AddUserForm } from "./user-form";
import { ResetPasswordButton } from "./reset-button";

export default async function AdminPage() {
    const session = await auth();
    // @ts-ignore
    const role = session?.user?.role;

    if (role !== "engineer") {
        redirect("/dashboard");
    }

    const allUsers = await db.select().from(users).orderBy(users.role);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
                <p className="text-muted-foreground">Manage system users and access controls.</p>
            </div>

            {/* Create User Form */}
            <div className="grid gap-6 md:grid-cols-2">
                <AddUserForm />

                {/* User Stats/Overview could go here */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                        <CardDescription>Current user distribution.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            <p><strong>Total Users:</strong> {allUsers.length}</p>
                            <p><strong>Operators:</strong> {allUsers.filter(u => u.role === 'operator').length}</p>
                            <p><strong>Supervisors (In-Charge/Manager):</strong> {allUsers.filter(u => u.role === 'shift_incharge' || u.role === 'manager').length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User List Table */}
            <Card>
                <CardHeader>
                    <CardTitle>User Directory</CardTitle>
                    <CardDescription>List of all registered accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'engineer' ? 'destructive' : user.role === 'manager' ? 'default' : 'outline'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <ResetPasswordButton userId={user.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

