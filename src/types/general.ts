export interface ImageTypes {
  base64: string;
  prompt: string;
}
export interface TextToImagePayloadProps {
  text: string;
  conditionImage?: string;
  options: {
    numberOfImages?: number;
    width?: number;
    height?: number;
    cfgScale?: number;
    quality?: string;
    seed?: number;
  };
  category?: {
    designStyles?: string;
    caseMaterials?: string;
    coolingMaterials?: string;
    colorsScheme?: string;
    lightingDesign?: string;
    cameraAngles?: string;
    cameraTemplates?: string;
  };
}
export interface TextToImageResponseProps {
  image_paths: string[];
  base64_images: string[];
  prompt: string;
}
export interface SearchResponseProps {
  original_prompt: string;
  optimized_prompt: string;
  results: {
    image_urls: string[];
  }[];
}
export interface InpaintingPayloadProps {
  text: string;
  negativeText: string;
  image: string;
  maskPrompt: string;
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
export interface VariationPayloadProps {
  text: string;
  image: string[];
  similarityStrength: number;
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
  negativeText?: string;
  maskPrompt?: string;
  similarityStrength?: number;
  cfgScale: number;
  numberOfImages: number;
  category?: {
    designStyles?: string;
    caseMaterials?: string;
    coolingMaterials?: string;
    colorsScheme?: string;
    lightingDesign?: string;
    cameraAngles?: string;
    cameraTemplates?: string;
  };
}
export const defaultFilter: AdvancedFilter = {
  width: 512,
  height: 512,
  seed: 991234,
  negativeText: '',
  maskPrompt: '',
  similarityStrength: 0.6,
  cfgScale: 3.5,
  numberOfImages: 1,
  category: {
    designStyles: '',
    caseMaterials: '',
    coolingMaterials: '',
    colorsScheme: '',
    lightingDesign: '',
    cameraAngles: '',
    cameraTemplates: '',
  },
};
