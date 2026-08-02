import { useQuery } from '@tanstack/react-query';
import { categoryService, type CategoryResponse } from '@/services/categoryService';
import { currencyService, type CurrencyResponse } from '@/services/currencyService';

export const MASTER_QUERY_KEYS = {
  categories: ['categories', 'all'] as const,
  currencies: ['currencies', 'all'] as const,
};

export function useCategories() {
  return useQuery<CategoryResponse[], Error>({
    queryKey: MASTER_QUERY_KEYS.categories,
    queryFn: () => categoryService.getAllCategories(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCurrencies() {
  return useQuery<CurrencyResponse[], Error>({
    queryKey: MASTER_QUERY_KEYS.currencies,
    queryFn: () => currencyService.getAllCurrencies(),
    staleTime: 1000 * 60 * 10,
  });
}
