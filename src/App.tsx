'use client';

import { useState } from 'react';
import ImageDisplay from './components/ImageDisplay';
import type { ImageGenerationResult } from './Temptypes';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { toast } from 'react-toastify';
import { ImageTypes } from './types';

export type AIOption = 'generateImage' | 'inpainting' | 'variation';

function App() {
  const [generatedImages, setGeneratedImages] = useState<
    ImageGenerationResult[]
  >([]);
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<ImageTypes[]>([
    // 'https://images.pexels.com/photos/1054666/pexels-photo-1054666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    // 'b',
    // 'c',
    // 'd',
    // 'e',
    // 'f',
  ]);
  const [searchImages, setSearchImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tab, setTab] = useState<AIOption>('generateImage');
  const [selectImage, setSelectImage] = useState<ImageTypes[]>([]);

  const handlePrompt = (value: string) => {
    setPrompt(value);
  };
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
    // setImages([...images, newImage.url]);
    setIsGenerating(false);
    setGeneratedImages((prev) => [newImage, ...prev]);
  };
  const handleImage = (value: ImageTypes[]) => {
    setImages([...value, ...images]);
  };
  const handleSearchImage = (value: string[]) => {
    setSearchImages([...value]);
  };
  const handleLoading = (value: boolean) => {
    setIsGenerating(value);
  };
  const handleTab = (value: AIOption) => {
    setTab(value);
    if (value === 'generateImage' && selectImage.length > 1) {
      toast.error('最多只能選擇一張圖片 QQ');
      setSelectImage([selectImage[0]]);
      return;
    }
    if (value === 'inpainting' && selectImage.length > 1) {
      toast.error('最多只能選擇一張圖片 QQ');
      setSelectImage([selectImage[0]]);
      return;
    }
  };
  const handleSelectImage = (value: ImageTypes[]) => {
    if (tab === 'generateImage' && value.length > 1) {
      toast.error('最多只能選擇一張圖片 QQ');
      setSelectImage([selectImage[0]]);
      return;
    }
    if (tab === 'inpainting' && value.length > 1) {
      toast.error('最多只能選擇一張圖片 QQ');
      setSelectImage([selectImage[0]]);
      return;
    }
    if (tab === 'inpainting' && value.length === 1) {
      handlePrompt(value[0].prompt);
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
        searchImages={searchImages}
        handleSearchImage={handleSearchImage}
      />
      <Sidebar
        tab={tab}
        handleTab={handleTab}
        prompt={prompt}
        handlePrompt={handlePrompt}
        images={images}
        handleImage={handleImage}
        searchImages={searchImages}
        handleSearchImage={handleSearchImage}
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
