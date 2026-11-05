import { useQuery } from '@tanstack/react-query';
import { fetchStockMedia } from '../services/stockMediaApi';
import { MediaType, StockMediaItem } from '../types/timeline';

/**
 * Custom React Query hook to manage server state and media asset caching
 */
export function useStockMedia(type: MediaType | 'all' = 'all', searchQuery = '') {
  return useQuery<StockMediaItem[], Error>({
    queryKey: ['stockMedia', type, searchQuery],
    queryFn: () => fetchStockMedia(type, searchQuery),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30,    // 30 minutes garbage collection
  });
}
