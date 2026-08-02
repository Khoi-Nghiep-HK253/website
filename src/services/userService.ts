import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';
import type { UserResponse, RegisterPayload } from './authService';

export interface SystemStats {
  activeUsers: number;
  totalRequests: number;
  serverUptime: string;
  lastUpdated: string;
}

export interface UserRoleData {
  role: string;
  permissions: string[];
  updatedAt: string;
}

export interface UpdateUserPayload {
  firstname?: string;
  lastname?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  /**
   * Fetch system statistics via Axios HTTP Client
   */
  async fetchSystemStats(): Promise<SystemStats> {
    try {
      return await axiosClient.get<unknown, ApiResponse<SystemStats>>('/stats').then((res) => res.data);
    } catch {
      await delay(400);
      return {
        activeUsers: 154,
        totalRequests: 28490,
        serverUptime: '99.98%',
        lastUpdated: new Date().toLocaleTimeString('vi-VN'),
      };
    }
  },

  /**
   * Update user role demo
   */
  async updateUserRole(newRole: string): Promise<UserRoleData> {
    try {
      return await axiosClient.post<unknown, ApiResponse<UserRoleData>>('/user/role', { role: newRole }).then((res) => res.data);
    } catch {
      await delay(300);
      return {
        role: newRole,
        permissions: newRole === 'Admin' ? ['read', 'write', 'delete'] : ['read', 'write'],
        updatedAt: new Date().toLocaleTimeString('vi-VN'),
      };
    }
  },

  /**
   * Get list of all users GET /api/users
   */
  async getAllUsers(): Promise<UserResponse[]> {
    const response = await axiosClient.get<unknown, ApiResponse<UserResponse[]>>('/users');
    return response.data;
  },

  /**
   * Get specific user by ID GET /api/users/{id}
   */
  async getUserById(id: number): Promise<UserResponse> {
    const response = await axiosClient.get<unknown, ApiResponse<UserResponse>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create user (Admin endpoint) POST /api/users
   */
  async createUser(payload: RegisterPayload): Promise<UserResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<UserResponse>>('/users', payload);
    return response.data;
  },

  /**
   * Update user profile PUT /api/users/{id}
   */
  async updateProfile(id: number, payload: UpdateUserPayload): Promise<UserResponse> {
    const response = await axiosClient.put<unknown, ApiResponse<UserResponse>>(`/users/${id}`, payload);
    return response.data;
  },

  /**
   * Change user password PATCH /api/users/{id}/password
   */
  async changePassword(id: number, payload: ChangePasswordPayload): Promise<string> {
    const response = await axiosClient.patch<unknown, ApiResponse<void>>(`/users/${id}/password`, payload);
    return response.message || 'Password changed successfully';
  },
};
