import type { NextFunction, Request, Response } from "express";
import type { AuthContext, Role } from "../types.js";
import { loadState } from "../repositories/local.repository.js";
import { env } from "../config/env.js";
import { createClient } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export async function validateSession(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (
    env.authMode === "supabase" &&
    token &&
    env.supabaseUrl &&
    env.supabaseServiceRoleKey
  ) {
    const client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
    const result = await client.auth.getUser(token);
    const user = result.data.user;
    req.auth = user
      ? { userId: user.id, roles: ["VIEWER"] }
      : { userId: "anonymous", roles: [] };
  } else {
    const user = token
      ? loadState().users.find(
          (item) => item.id === token || item.email === token,
        )
      : undefined;
    req.auth = user
      ? {
          userId: user.id,
          roles: [user.role] as Role[],
          departmentId: user.department,
          districtId: user.district,
        }
      : { userId: "anonymous", roles: [] };
  }
  next();
}

export function requireRoles(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth?.roles.some((role) => roles.includes(role)))
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You are not authorized for this operation.",
        },
      });
    next();
  };
}
