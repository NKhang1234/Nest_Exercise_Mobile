import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: { id: string; name: string; avatar?: string; [key: string]: any };
}
