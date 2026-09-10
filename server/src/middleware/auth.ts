import type { NextFunction, Request, Response } from 'express';
import type { AuthContext, Role } from '../types.js';

declare global { namespace Express { interface Request { auth?: AuthContext } } }

export function validateSession(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  req.auth = { userId: token || 'demo-national-admin', roles: ['NATIONAL_ADMIN'] as Role[] };
  next();
}

export function requireRoles(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth?.roles.some(role => roles.includes(role))) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You are not authorized for this operation.' } });
    next();
  };
}

