"use client"

import type React from "react"

import { useState } from "react"
import { Sparkles, Sliders, RefreshCw, ImageIcon } from "lucide-react"
import type { GenerationParams } from "../types"

interface PromptPanelProps {
  onGenerate: (prompt: string, params: Record<string, any>) => void
  isGenerating: boolean
}

const PromptPanel = ({ onGenerate, isGenerating }: PromptPanelProps) => {
  const [prompt, setPrompt] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [params, setParams] = useState<GenerationParams>({
    width: 512,
    height: 512,
    quality: 75,
    style: "photorealistic",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt, params)
    }
  }

  const handleParamChange = (name: keyof GenerationParams, value: any) => {
    setParams((prev) => ({ ...prev, [name]: value }))
  }

  const generateRandomSeed = () => {
    handleParamChange("seed", Math.floor(Math.random() * 1000000))
  }

  return (
    <div className="w-full md:w-1/3 h-full overflow-auto p-6 bg-gray-800">
      <h2 className="text-2xl font-bold mb-6">Create Image</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Prompt
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cityscape with flying cars and neon lights..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
              required
            />
            <Sparkles className="absolute right-3 bottom-3 text-gray-400" size={20} />
          </div>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <Sliders size={16} />
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 mb-6 p-4 bg-gray-700 rounded-lg">
            <div>
              <label htmlFor="width" className="block text-sm font-medium mb-1">
                Width: {params.width}px
              </label>
              <input
                type="range"
                id="width"
                min="256"
                max="1024"
                step="64"
                value={params.width}
                onChange={(e) => handleParamChange("width", Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium mb-1">
                Height: {params.height}px
              </label>
              <input
                type="range"
                id="height"
                min="256"
                max="1024"
                step="64"
                value={params.height}
                onChange={(e) => handleParamChange("height", Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="quality" className="block text-sm font-medium mb-1">
                Quality: {params.quality}%
              </label>
              <input
                type="range"
                id="quality"
                min="25"
                max="100"
                step="5"
                value={params.quality}
                onChange={(e) => handleParamChange("quality", Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="style" className="block text-sm font-medium mb-1">
                Style
              </label>
              <select
                id="style"
                value={params.style}
                onChange={(e) => handleParamChange("style", e.target.value)}
                className="w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
              >
                <option value="photorealistic">Photorealistic</option>
                <option value="anime">Anime</option>
                <option value="digital-art">Digital Art</option>
                <option value="oil-painting">Oil Painting</option>
                <option value="watercolor">Watercolor</option>
                <option value="pixel-art">Pixel Art</option>
              </select>
            </div>

            <div>
              <label htmlFor="seed" className="block text-sm font-medium mb-1">
                Seed (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="seed"
                  value={params.seed || ""}
                  onChange={(e) => handleParamChange("seed", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Random"
                  className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                />
                <button
                  type="button"
                  onClick={generateRandomSeed}
                  className="p-2 bg-gray-600 border border-gray-500 rounded-lg hover:bg-gray-500"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium ${
            !prompt.trim() || isGenerating
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon size={20} />
              Generate Image
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-400">
        <p className="mb-2">Tips:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Be specific about what you want to see</li>
          <li>Include details about style, lighting, and composition</li>
          <li>Use descriptive adjectives to guide the generation</li>
          <li>Specify camera angles or perspectives if relevant</li>
        </ul>
      </div>
    </div>
  )
}

export default PromptPanel
