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
        _id: string;
        email?: string;
      };
    }
  }
}
