import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';

export interface CurrencyResponse {
  id: number;
  name: string;
  code?: string;
  acronym?: string;
  symbol?: string;
}

export const currencyService = {
  async getAllCurrencies(): Promise<CurrencyResponse[]> {
    try {
      const response = await axiosClient.get<unknown, ApiResponse<CurrencyResponse[]>>('/currencies');
      return response.data;
    } catch {
      return [
        { id: 1, name: 'Vietnamese Dong', code: 'VND', acronym: 'VND', symbol: 'đ' },
        { id: 2, name: 'US Dollar', code: 'USD', acronym: 'USD', symbol: '$' },
        { id: 3, name: 'Euro', code: 'EUR', acronym: 'EUR', symbol: '€' },
      ];
    }
  },
};
