import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';

export interface CategoryResponse {
  id: number;
  name: string;
  icon?: string;
}

export const categoryService = {
  async getAllCategories(): Promise<CategoryResponse[]> {
    try {
      const response = await axiosClient.get<unknown, ApiResponse<CategoryResponse[]>>('/categories');
      return response.data;
    } catch {
      // Fallback default categories if backend table is not pre-populated yet
      return [
        { id: 1, name: 'Du lịch & Dã ngoại', icon: 'flight' },
        { id: 2, name: 'Sinh hoạt & Trọ', icon: 'home' },
        { id: 3, name: 'Ăn uống & Giải trí', icon: 'restaurant' },
        { id: 4, name: 'Thể thao & Đá bóng', icon: 'sports' },
        { id: 5, name: 'Học tập & Làm việc', icon: 'work' },
      ];
    }
  },
};
