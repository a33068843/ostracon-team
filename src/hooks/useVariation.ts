import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from './constants';
import { TextToImageResponseProps, VariationPayloadProps } from '../types';
import { filterBase64 } from '../utils';

interface useVariationProps {
  options?: {
    onStart?: () => void;
    onSuccess?: (data: TextToImageResponseProps) => void;
    onError?: (error: Error) => void;
  };
}

export const useVariation = (props: useVariationProps) => {
  const { options } = props;
  return useMutation({
    mutationFn: async (payload: VariationPayloadProps) => {
      options?.onStart?.();
      const body = {
        imageVariationParams: {
          text: payload.text,
          images: payload.image.map((image) => filterBase64(image)),
          similarityStrength: payload.similarityStrength,
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          width: payload.options.width,
          height: payload.options.height,
          cfgScale: 3.5,
          quality: 'standard',
        },
      };
      const response = await fetch(`${BASE_URL}/variation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<TextToImageResponseProps>;
    },
    onSuccess: (data, variable) => {
      options?.onSuccess?.({ ...data, prompt: variable.text });
    },
    onError(error) {
      options?.onError?.(error);
    },
  });
};
