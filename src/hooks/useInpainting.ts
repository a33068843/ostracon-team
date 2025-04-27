import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from './constants';
import { InpaintingPayloadProps, TextToImageResponseProps } from '../types';
import { filterBase64 } from '../utils';

interface useInpaintingProps {
  options?: {
    onStart?: () => void;
    onSuccess?: (data: TextToImageResponseProps) => void;
    onError?: (error: Error) => void;
  };
}

export const useInpainting = (props: useInpaintingProps) => {
  const { options } = props;
  return useMutation({
    mutationFn: async (payload: InpaintingPayloadProps) => {
      options?.onStart?.();
      const body = {
        taskType: 'INPAINTING',
        inPaintingParams: {
          text: payload.text,
          image: filterBase64(payload.image),
          ...(payload.negativeText && { negativeText: payload.negativeText }),
          ...(payload.maskPrompt && { maskPrompt: payload.maskPrompt }),
        },
        imageGenerationConfig: {
          numberOfImages: payload.options.numberOfImages,
          width: payload.options.width,
          height: payload.options.height,
          cfgScale: payload.options.cfgScale,
          quality: 'standard',
          seed: payload.options.seed,
        },
      };
      const response = await fetch(`${BASE_URL}/inpainting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      console.log(response);
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
