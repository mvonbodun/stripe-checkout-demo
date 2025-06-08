import { NextResponse } from 'next/server';

// Test endpoint for cart functionality
export async function GET() {
  return NextResponse.json({ 
    message: 'Test cart endpoint',
    status: 'ok' 
  });
}