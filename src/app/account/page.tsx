'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccountPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const data = await response.json();
          setIsSignedIn(data.isSignedIn);
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      setIsSignedIn(false);
      setUsername('');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isSignUp: boolean) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`/api/auth/${isSignUp ? 'signup' : 'signin'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSignedIn(true);
        setUsername(username);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(`${isSignUp ? 'Sign up' : 'Sign in'} error:`, error);
      alert(`An error occurred during ${isSignUp ? 'sign up' : 'sign in'}`);
    }
  };

  if (isSignedIn) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Welcome, {username}!</CardTitle>
            <CardDescription>You are currently signed in.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Sign in to your account here.</CardDescription>
            </CardHeader>
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="signin-username">Username</Label>
                  <Input id="signin-username" name="username" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Sign In</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account here.</CardDescription>
            </CardHeader>
            <form onSubmit={(e) => handleSubmit(e, true)}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input id="signup-username" name="username" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Sign Up</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}