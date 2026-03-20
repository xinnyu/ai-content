export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  name: string;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
