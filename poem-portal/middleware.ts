import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Determine the allowed origin based on environment
const allowedOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.ALLOWED_ORIGIN 
  : '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin || '*', // Fallback to * if ALLOWED_ORIGIN is not set
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204, // No Content
      headers: corsHeaders,
    });
  }

  // Apply CORS headers to actual requests
  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*', // Apply CORS to all API routes
}; 