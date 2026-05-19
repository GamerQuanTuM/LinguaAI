import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

type RouteHandler = (
  req: AuthenticatedRequest,
  context?: any
) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: RouteHandler) {
  return async (req: AuthenticatedRequest, context?: any) => {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };
        req.user = decoded;
      } catch (e: any) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
      }

      return await handler(req, context);
    } catch (error: any) {
      console.error('Auth middleware error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}
