import { Request } from 'express';

export interface PartialUser {
  id: string;
  name: string;
  role?: 'planner' | 'client' | 'admin';
}

export interface UserRequestWithData extends Request {
  user: PartialUser;
}
