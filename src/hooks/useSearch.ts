import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from './constants';
import { SearchResponseProps } from '../types';

interface useSearchProps {
  options?: {
    onStart?: () => void;
    onSuccess?: (data: SearchResponseProps) => void;
    onError?: (error: Error) => void;
  };
}

export const useSearch = (props: useSearchProps) => {
  const { options } = props;
  return useMutation({
    mutationFn: async (search: string) => {
      options?.onStart?.();
      const response = await fetch(`${BASE_URL}/search?request=${search}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<SearchResponseProps>;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError(error) {
      options?.onError?.(error);
    },
  });
};
