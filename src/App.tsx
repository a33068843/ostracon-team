'use client';

import { useState } from 'react';
import ImageDisplay from './components/ImageDisplay';
import type { ImageGenerationResult } from './Temptypes';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { toast } from 'react-toastify';

export type AIOption = 'generateImage' | 'inpainting';

function App() {
  const [generatedImages, setGeneratedImages] = useState<
    ImageGenerationResult[]
  >([]);
  const [images, setImages] = useState<string[]>([
    'https://images.pexels.com/photos/1054666/pexels-photo-1054666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'b',
    'c',
    'd',
    'e',
    'f',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tab, setTab] = useState<AIOption>('generateImage');
  const [selectImage, setSelectImage] = useState<string[]>([]);
  console.log(selectImage);

  const handleGenerate = async (
    prompt: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Record<string, any>
  ) => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, we're generating a placeholder image
    // In a real app, you would call an actual AI image generation API
    const newImage: ImageGenerationResult = {
      id: Date.now().toString(),
      url: `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(
        prompt
      )}`,
      prompt,
      params,
      timestamp: new Date().toISOString(),
    };
    setImages([...images, newImage.url]);
    setIsGenerating(false);
    setGeneratedImages((prev) => [newImage, ...prev]);
  };
  const handleImage = (value: string) => {
    setImages([value, ...images]);
  };
  const handleLoading = (value: boolean) => {
    setIsGenerating(value);
  };
  const handleTab = (value: AIOption) => {
    setTab(value);
    if (value === 'generateImage' && selectImage.length > 5) {
      toast.error('最多只能選擇五張圖片 QQ');
      setSelectImage(selectImage.slice(-5));
      return;
    }
    if (value === 'inpainting' && selectImage.length > 1) {
      toast.error('最多只能選擇一張圖片 QQ');
      setSelectImage([selectImage[0]]);
      return;
    }
  };
  const handleSelectImage = (value: string[]) => {
    if (tab === 'generateImage' && value.length > 5) {
      toast.error('最多只能選擇五張圖片 QQ');
      setSelectImage(value.slice(-5));
      return;
    }
    if (tab === 'inpainting' && value.length > 1) {
      toast.error('最多只能選擇一張圖片 QQ');
      setSelectImage([selectImage[0]]);
      return;
    }
    setSelectImage(value);
  };

  return (
    <div
      id='container'
      className='flex flex-col md:flex-row h-screen bg-gray-900 text-gray-100'
    >
      <ImageDisplay
        images={images}
        isLoading={isGenerating}
        selectImage={selectImage}
        handleSelectImage={handleSelectImage}
      />
      <Sidebar
        tab={tab}
        handleTab={handleTab}
        images={images}
        handleImage={handleImage}
        handleLoading={handleLoading}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        selectImage={selectImage}
        handleSelectImage={handleSelectImage}
      />
    </div>
  );
}

export default App;
