import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from './constants';
import { TextToImagePayloadProps, TextToImageResponseProps } from '../types';
import { filterBase64 } from '../utils';

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
      console.log(payload);
      const { category = {} } = payload;
      options?.onStart?.();
      const newText = `${payload.text} ${(() => {
        return Object.entries(category)
          .filter((item) => !!item)
          .map((item) => {
            return `, ${item}`;
          })
          .join('');
      })()}`;
      const body = {
        taskType: 'TEXT_IMAGE',
        textImageParams: {
          text: newText,
          ...(payload.conditionImage && {
            conditionImage: filterBase64(payload.conditionImage),
          }),
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
    onSuccess: (data, variable) => {
      console.log(data);
      options?.onSuccess?.({ ...data, prompt: variable.text });
    },
    onError(error) {
      options?.onError?.(error);
    },
  });
};
