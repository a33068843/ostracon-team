import { useState } from 'react';
import { AIOption } from '../App';
import { InpaintingPanel } from './InpaintingPanel';
import PromptPanel from './PromptPanel';
import { AdvancedFilter } from '../types';

interface SidebarProps {
  tab: AIOption;
  handleTab: (v: AIOption) => void;
  images?: string[];
  handleImage: (value: string) => void;
  handleLoading: (value: boolean) => void;
  selectImage: string[];
  handleSelectImage: (value: string[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGenerate: (prompt: string, params: Record<string, any>) => void;
  isGenerating: boolean;
}
export const Sidebar = (props: SidebarProps) => {
  const {
    tab,
    handleTab,
    images,
    handleImage,
    selectImage,
    handleSelectImage,
    handleLoading,
    onGenerate,
    isGenerating,
  } = props;
  const [prompt, setPrompt] = useState('');
  const [filter, setFilter] = useState<AdvancedFilter>({
    width: 512,
    height: 512,
    seed: 0,
  });
  const isGenerateTab = tab === 'generateImage';
  const isInpaintingTab = tab === 'inpainting';
  const activeStyle = `border-orange-400 bg-orange-400 text-white`;

  const handlePrompt = (value: string) => {
    setPrompt(value);
  };
  const handleFilter = (filter: AdvancedFilter) => {
    setFilter(filter);
  };

  return (
    <div className='w-full md:w-1/3 h-full overflow-auto p-6 bg-gray-800'>
      <div className='flex flex-column'>
        <p className='text-lg font-bold mb-2'>生成類別</p>
      </div>
      <div className={`flex gap-2 mb-2 `}>
        <div
          onClick={() => handleTab('generateImage')}
          className={`flex justify-center items-center px-4 py-1 duration-200 border rounded border-gray-700 text-sm font-normal cursor-pointer ${
            isGenerateTab && activeStyle
          }`}
        >
          Generate
        </div>
        <div
          onClick={() => handleTab('inpainting')}
          className={`flex justify-center items-center px-4 py-1 duration-200 border rounded border-gray-700 text-sm font-normal cursor-pointer ${
            isInpaintingTab && activeStyle
          }`}
        >
          Inpainting
        </div>
      </div>

      {isGenerateTab && (
        <PromptPanel
          images={images}
          handleImage={handleImage}
          handleLoading={handleLoading}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
          prompt={prompt}
          handlePrompt={handlePrompt}
          filter={filter}
          handleFilter={handleFilter}
        />
      )}
      {isInpaintingTab && (
        <InpaintingPanel
          images={images}
          handleImage={handleImage}
          handleLoading={handleLoading}
          isGenerating={isGenerating}
          prompt={prompt}
          handlePrompt={handlePrompt}
          filter={filter}
          handleFilter={handleFilter}
        />
      )}
    </div>
  );
};
