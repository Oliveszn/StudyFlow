export {};
declare global {
  namespace Express {
    interface Request {
      redisClient?: Redis;
    }
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
        emailVerified?: boolean;
      };
    }
  }
}
