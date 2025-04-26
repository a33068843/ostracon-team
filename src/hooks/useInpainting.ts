import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from './constants';
import { InpaintingPayloadProps, TextToImageResponseProps } from '../types';
import { base64 } from '../assets/mock';

interface useInpaintingProps {
  options?: {
    onStart?: () => void;
    onSuccess?: (data: TextToImageResponseProps) => void;
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
          image: payload.image,
          negativeText: 'CAR',
          maskPrompt: 'a dog',
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          width: payload.options.width,
          height: payload.options.height,
          cfgScale: 3.5,
          quality: 'standard',
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
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
  });
};
