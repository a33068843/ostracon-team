export interface TextToImagePayloadProps {
  text: string;
  options: {
    numberOfImages?: number;
    width?: number;
    height?: number;
    cfgScale?: number;
    quality?: string;
    seed?: number;
  };
}
export interface TextToImageResponseProps {
  image_paths: string[];
  base64_images: string[];
}
export interface InpaintingPayloadProps {
  text: string;
  negativeText?: string;
  image?: string;
  maskPrompt?: string;
  maskImage?: string;
  options: {
    numberOfImages?: number;
    width?: number;
    height?: number;
    cfgScale?: number;
    quality?: string;
    seed?: number;
  };
}
export interface AdvancedFilter {
  width: number;
  height: number;
  seed?: number;
}
