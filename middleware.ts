import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Use jose for JWT verification in Edge runtime

// Read secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Function to verify JWT using jose (Edge compatible)
async function verifyToken(token: string): Promise<boolean> {
  if (!token || !JWT_SECRET) return false; // Also check if JWT_SECRET is available
  try {
    // Encode the secret key
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    // Verify the token
    await jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    console.error('JWT Verification Error (Middleware):', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  // Basic validation for environment variable used in verifyToken
  if (!JWT_SECRET) {
    console.error('Missing JWT_SECRET environment variable for middleware');
    // Avoid redirect loop, maybe return a generic error or allow access but log severely?
    // For simplicity, we might just let verifyToken handle it, but logging here is good.
  }

  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session_token')?.value;

  // Skip checks for the login page itself and Next.js internals
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || // Allow API routes (login itself)
      pathname.includes('.')) { // Ignore files like favicon.ico
    return NextResponse.next();
  }

  // Verify the token
  const isValid = await verifyToken(sessionToken || '');

  if (!isValid) {
    // Redirect to login if token is invalid or missing
    const loginUrl = new URL('/login', request.url);
    // Optional: Add a redirect query parameter if needed
    // loginUrl.searchParams.set('redirectedFrom', pathname);
    console.log(`Middleware: Invalid or missing token for path ${pathname}. Redirecting to login.`);
    return NextResponse.redirect(loginUrl);
  }

  // Token is valid, allow request to proceed
  return NextResponse.next();
}

// Define paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * And ensure it doesn't match the login page itself.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
    '/', // Explicitly match the root path
  ],
}; 