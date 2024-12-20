'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeToggle } from "@/components/tools";
import { Button } from "@/components/ui/button";
import { House, BookOpenText, PersonSimpleCircle, TreeEvergreen } from "@phosphor-icons/react/dist/ssr";

const inter = Inter({ subsets: ["latin"] });

export default function HomePageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const data = await response.json();
          setIsSignedIn(data.isSignedIn);
          setUsername(data.username || '');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col h-screen">
            <nav className="flex items-center justify-center p-4 backdrop-blur-sm z-10">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                  <House weight="fill" className="mr-2" /> Home
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/trees')}>
                  <TreeEvergreen weight="fill" className="mr-2" /> Trees
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/account')}>
                  <PersonSimpleCircle weight="fill" className="mr-2" />
                  {isSignedIn ? username : 'Account'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/docs')}>
                  <BookOpenText weight="fill" className="mr-2" /> Docs
                </Button>
                <ThemeToggle />
              </div>
            </nav>
            <main className="flex-grow overflow-hidden relative">
              <div className="absolute inset-0 pointer-events-none vignette"></div>
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}