import { NextRequest, NextResponse } from 'next/server';

// Example structure for storing passwords securely (use environment variables)
const DEMO_PASSWORDS: Record<string, string> = {
  'theta-assistant': process.env.DEMO_PASSWORD_THETA_ASSISTANT || '',
  'content-format': process.env.DEMO_PASSWORD_CONTENT_FORMAT || '',
  'confidence-demo': process.env.DEMO_PASSWORD_CONFIDENCE || '',
  // Add other demo IDs and their corresponding env variable names here
  // 'another-demo': process.env.DEMO_PASSWORD_ANOTHER || '',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { demoId, password } = body;

    if (!demoId || typeof demoId !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const correctPassword = DEMO_PASSWORDS[demoId];

    // Optional: Keep logging for initial setup of project-home?
    // console.log("--- Password Check (API Route) ---");
    // console.log("Timestamp:", new Date().toISOString());
    // console.log("Received demoId:", demoId);
    // console.log("Received password attempt:", password);
    // console.log("Expected password from env:", correctPassword);
    // console.log("Env var exists/loaded:", !!correctPassword);

    // IMPORTANT: Basic check. In a real app, use a secure comparison function (e.g., bcrypt.compare)
    // if the passwords were hashed. For simple string comparison:
    const isAuthorized = correctPassword && correctPassword === password;

    // console.log("Authorization result:", isAuthorized); // Log result too
    // console.log("------------------------------------");

    if (isAuthorized) {
      return NextResponse.json({ authorized: true });
    } else {
      // Generic message to avoid leaking info about valid demo IDs
      return NextResponse.json({ authorized: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error("Password check error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 