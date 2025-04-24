import type { ImageGenerationResult } from "../types"
import { Download, Maximize, Share2 } from "lucide-react"

interface ImageDisplayProps {
  images: ImageGenerationResult[]
  isLoading: boolean
}

const ImageDisplay = ({ images, isLoading }: ImageDisplayProps) => {
  return (
    <div className="w-full md:w-2/3 h-full overflow-auto p-6 border-r border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Generated Images</h2>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 border border-gray-700 rounded-lg bg-gray-800 mb-6">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Generating your masterpiece...</p>
        </div>
      )}

      {images.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 p-8 border border-gray-700 rounded-lg bg-gray-800">
          <p className="text-gray-400 text-center mb-4">No images generated yet</p>
          <p className="text-gray-500 text-center">Enter a prompt on the right panel to create your first image</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.prompt}
                className="w-full aspect-square object-cover rounded-lg border border-gray-700 bg-gray-800"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-4">
                  <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                    <Download size={20} />
                  </button>
                  <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                    <Maximize size={20} />
                  </button>
                  <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400 truncate">{image.prompt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageDisplay
