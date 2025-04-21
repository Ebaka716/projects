"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert"; // For showing errors

// Define the structure for a demo
interface DemoInfo {
  id: string; // Unique ID used for password checking
  title: string;
  description: string;
  url: string;
  requiresPassword: boolean;
  isExternal?: boolean; // Flag for external URLs
}

// Utility function to check if a URL is external
const isExternalUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (_e) {
    // If parsing fails, assume it's an internal path
    return false;
  }
};

// List of demos - Add your other demos here later
const demos: DemoInfo[] = [
  {
    id: 'theta-assistant', // ID for this demo
    title: 'Theta Assistant',
    description: 'An AI assistant for financial queries and market data.',
    url: 'https://ui-shadcn-three.vercel.app/', // Corrected URL to the root
    requiresPassword: true, // Updated password requirement
    isExternal: true,
  },
  {
    id: 'content-format', // New demo ID
    title: 'Content Format Preview',
    description: 'Create and preview your content in different formats.',
    url: 'https://3v2.vercel.app/', // New demo URL
    requiresPassword: true, // Requires password
    isExternal: true,
  },
  {
    id: 'confidence-demo', // ID matches the one in the API route
    title: 'Confidence Score Demo',
    description: 'A demonstration of confidence scoring features.',
    url: '/confidence-demo', // Make sure this route exists or update as needed
    requiresPassword: true, // This one requires a password
    isExternal: false, // This is internal
  },
  // {
  //   id: 'another-demo',
  //   title: 'Another Demo',
  //   description: 'Description for another demo.',
  //   url: '/another-demo',
  //   requiresPassword: true,
  //   isExternal: false
  // },
];

export default function DemosPage() {
  const router = useRouter();
  const [selectedDemo, setSelectedDemo] = useState<DemoInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to navigate based on URL type
  const navigateToDemo = (url: string) => {
    if (isExternalUrl(url)) {
      window.location.href = url; // Use window.location for external links
    } else {
      router.push(url); // Use router for internal links
    }
  };

  const handleViewClick = (demo: DemoInfo) => {
    if (demo.requiresPassword) {
      setSelectedDemo(demo);
      setPasswordInput(''); // Clear previous input
      setError(null); // Clear previous errors
      setIsDialogOpen(true);
    } else {
      navigateToDemo(demo.url); // Use the navigation function
    }
  };

  const handlePasswordSubmit = async () => {
    if (!selectedDemo || !passwordInput) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/check-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          demoId: selectedDemo.id,
          password: passwordInput,
        }),
      });

      const result = await response.json();

      if (response.ok && result.authorized) {
        setIsDialogOpen(false);
        navigateToDemo(selectedDemo.url); // Use the navigation function
      } else {
        setError(result.error || 'Invalid password.');
      }
    } catch (err) {
      console.error("Password check failed:", err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background">
      <h1 className="mb-12 text-4xl font-semibold">Project Demos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {demos.map((demo) => (
          <Card key={demo.id}>
            <CardHeader>
              <CardTitle>{demo.title}</CardTitle>
              <CardDescription>{demo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* URL Display Removed */}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleViewClick(demo)} 
                className="w-full bg-black text-white hover:bg-black/80"
              >
                View Demo
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Password Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Password Required</DialogTitle>
            <DialogDescription>
              Enter the password to access the &quot;{selectedDemo?.title}&quot; demo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
            </div>
            {error && (
               <Alert variant="destructive">
                 <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handlePasswordSubmit}
              disabled={isLoading || !passwordInput}
            >
              {isLoading ? 'Verifying...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
} 