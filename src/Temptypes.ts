export interface ImageGenerationResult {
  id: string
  url: string
  prompt: string
  params: Record<string, any>
  timestamp: string
}

export interface GenerationParams {
  width: number
  height: number
  quality: number
  style: string
  seed?: number
}
