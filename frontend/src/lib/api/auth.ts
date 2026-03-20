import { api } from './client';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SetupStatus {
  hasUsers: boolean;
  totalUsers: number;
}

export const authApi = {
  login(username: string, password: string) {
    return api.post<{ user: AuthUser; expiresAt: string }>('/auth/login', {
      username,
      password,
    });
  },

  logout() {
    return api.post<{ success: boolean }>('/auth/logout');
  },

  me() {
    return api.get<AuthUser>('/auth/me');
  },

  setupStatus() {
    return api.get<SetupStatus>('/auth/setup-status');
  },
};
