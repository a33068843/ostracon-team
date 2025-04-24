"use client"

import { useState } from "react"
import ImageDisplay from "./components/ImageDisplay"
import PromptPanel from "./components/PromptPanel"
import type { ImageGenerationResult } from "./types"
import "./App.css"

function App() {
  const [generatedImages, setGeneratedImages] = useState<ImageGenerationResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (prompt: string, params: Record<string, any>) => {
    setIsGenerating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, we're generating a placeholder image
    // In a real app, you would call an actual AI image generation API
    const newImage: ImageGenerationResult = {
      id: Date.now().toString(),
      url: `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(prompt)}`,
      prompt,
      params,
      timestamp: new Date().toISOString(),
    }

    setGeneratedImages((prev) => [newImage, ...prev])
    setIsGenerating(false)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-100">
      <ImageDisplay images={generatedImages} isLoading={isGenerating} />
      <PromptPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
    </div>
  )
}

export default App
