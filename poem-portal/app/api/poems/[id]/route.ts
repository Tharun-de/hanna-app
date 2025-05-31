import { NextRequest, NextResponse } from 'next/server';

type ApiContext = { params: { id: string } };

export async function GET(request: NextRequest, context: ApiContext) {
  const { id } = context.params;
  return NextResponse.json({ message: `Test GET for id: ${id}` });
}

export async function PUT(request: NextRequest, context: ApiContext) {
  const { id } = context.params;
  const body = await request.json().catch(() => ({})); // Gracefully handle no body or errors
  return NextResponse.json({ message: `Test PUT for id: ${id}`, body });
}

export async function DELETE(request: NextRequest, context: ApiContext) {
  const { id } = context.params;
  return NextResponse.json({ message: `Test DELETE for id: ${id}` });
}

/* Remove OPTIONS handler, now handled by middleware
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
*/ 