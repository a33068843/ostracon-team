import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from './constants';
import { TextToImagePayloadProps, TextToImageResponseProps } from '../types';

interface useTextToImageProps {
  options?: {
    onStart?: () => void;
    onSuccess?: (data: TextToImageResponseProps) => void;
    onError?: (error: Error) => void;
  };
}

export const useTextToImage = (props: useTextToImageProps) => {
  const { options } = props;
  return useMutation({
    mutationFn: async (payload: TextToImagePayloadProps) => {
      options?.onStart?.();
      const body = {
        taskType: 'TEXT_IMAGE',
        textImageParams: {
          text: payload.text,
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          width: payload.options.width,
          height: payload.options.height,
          cfgScale: 3.5,
          quality: 'standard',
        },
      };
      const response = await fetch(`${BASE_URL}/text-to-image`, {
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
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError(error) {
      options?.onError?.(error);
    },
  });
};
