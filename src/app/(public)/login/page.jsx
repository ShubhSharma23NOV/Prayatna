"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useApp();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (role) => {
        setLoading(true);
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        login(role);
        router.push('/dashboard');
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-muted/20">
            <Card className="w-full max-w-sm shadow-xl border-primary/10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            placeholder="name@example.com" 
                            type="email" 
                            disabled={loading}
                            autoComplete="new-password"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••" 
                            disabled={loading}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Tabs defaultValue="engineer" className="w-full">
                        <div className="text-[10px] text-muted-foreground text-center mb-2 uppercase tracking-wide">Select Role for Demo</div>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="engineer">Engineer</TabsTrigger>
                            <TabsTrigger value="student">Student</TabsTrigger>
                        </TabsList>
                        <TabsContent value="engineer">
                            <Button
                                className="w-full mt-2"
                                onClick={() => handleLogin('Engineer')}
                                disabled={loading}
                            >
                                {loading ? "Authenticating..." : "Login as Engineer"}
                            </Button>
                        </TabsContent>
                        <TabsContent value="student">
                            <Button
                                className="w-full mt-2"
                                onClick={() => handleLogin('Student')}
                                disabled={loading}
                            >
                                {loading ? "Authenticating..." : "Login as Student"}
                            </Button>
                        </TabsContent>
                    </Tabs>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
