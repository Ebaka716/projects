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

// Define the structure for a demo
interface DemoInfo {
  id: string; // Unique ID used for password checking (kept for key prop)
  title: string;
  description: string;
  url: string;
  requiresPassword: boolean; // Will be set to false
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

// List of demos - Passwords no longer required
const demos: DemoInfo[] = [
  {
    id: 'theta-assistant',
    title: 'Theta Assistant',
    description: 'An AI assistant for financial queries and market data.',
    url: 'https://ui-shadcn-three.vercel.app/',
    requiresPassword: false, // Changed
    isExternal: true,
  },
  {
    id: 'content-format',
    title: 'Content Format Preview',
    description: 'Create and preview your content in different formats.',
    url: 'https://3v2.vercel.app/',
    requiresPassword: false, // Changed
    isExternal: true,
  },
  // Removed Confidence Score Demo
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

  // Function to navigate based on URL type
  const navigateToDemo = (url: string) => {
    if (isExternalUrl(url)) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };

  // Simplified handler - directly navigates
  const handleViewClick = (demo: DemoInfo) => {
    navigateToDemo(demo.url);
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
    </main>
  );
}
