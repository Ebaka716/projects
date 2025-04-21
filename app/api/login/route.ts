import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Read secrets from environment variables
const CORRECT_PASSWORD = process.env.LOGIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1h'; // Token expires in 1 hour

export async function POST(request: Request) {
  // Basic validation for environment variables
  if (!CORRECT_PASSWORD || !JWT_SECRET) {
    console.error('Missing LOGIN_PASSWORD or JWT_SECRET environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password === CORRECT_PASSWORD) {
      // Password is correct - Generate JWT
      const payload = { sub: 'user-auth', iat: Math.floor(Date.now() / 1000) }; // Simple payload
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

      // Create response and set JWT in an HttpOnly cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF
        maxAge: 60 * 60, // 1 hour (in seconds)
        path: '/', // Cookie available for all paths
      });

      console.log("Login successful, JWT cookie set (API)");
      return response; // Return the response with the cookie
    } else {
      // Incorrect password
      console.log("Incorrect password attempt (API)");
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 