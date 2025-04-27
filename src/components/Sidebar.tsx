import { useState } from 'react';
import { AIOption } from '../App';
import { InpaintingPanel } from './InpaintingPanel';
import PromptPanel from './PromptPanel';
import { AdvancedFilter, ImageTypes } from '../types';
import { VariationPanel } from './VariationPanel';

interface SidebarProps {
  tab: AIOption;
  handleTab: (v: AIOption) => void;
  prompt: string;
  handlePrompt: (value: string) => void;
  images?: ImageTypes[];
  handleImage: (value: ImageTypes[]) => void;
  searchImages?: string[];
  handleSearchImage: (value: string[]) => void;
  handleLoading: (value: boolean) => void;
  selectImage: ImageTypes[];
  handleSelectImage: (value: ImageTypes[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGenerate: (prompt: string, params: Record<string, any>) => void;
  isGenerating: boolean;
}
export const Sidebar = (props: SidebarProps) => {
  const {
    tab,
    handleTab,
    prompt,
    handlePrompt,
    images,
    handleImage,
    searchImages,
    handleSearchImage,
    selectImage,
    handleSelectImage,
    handleLoading,
    onGenerate,
    isGenerating,
  } = props;
  const [filter, setFilter] = useState<AdvancedFilter>({
    width: 512,
    height: 512,
    seed: 0,
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
  });
  const [search, setSearch] = useState('');
  const isGenerateTab = tab === 'generateImage';
  const isInpaintingTab = tab === 'inpainting';
  const isVariationTab = tab === 'variation';
  const activeStyle = `border-orange-400 bg-orange-400 text-white`;

  const handleFilter = (filter: AdvancedFilter) => {
    setFilter(filter);
  };
  const handleCustomTab = (tab: AIOption) => {
    handleTab(tab);
    if (tab === 'inpainting' && selectImage.length === 1) {
      handlePrompt(selectImage[0].prompt);
    }
  };

  return (
    <div className='w-full md:w-1/3 h-full overflow-auto p-6 bg-gray-800'>
      {/* <div className='flex flex-column'>
        <p className='text-lg font-bold mb-2'>Search History Database</p>
      </div>
      <div className='flex items-center justify-center gap-1 mb-4'>
        <input
          id='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full py-1 px-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
          required
        />
        <button className='px-1 py-1 bg-orange-400 rounded text-xs cursor-pointer hover:brightness-90 duration-200 active:brightness-80'>
          Search
        </button>
      </div> */}

      <div className='flex flex-column'>
        <p className='text-lg font-bold mb-2'>Actions</p>
      </div>
      <div className={`flex gap-2 mb-2 flex-wrap `}>
        <div
          onClick={() => handleCustomTab('generateImage')}
          className={`min-w-[100px] flex justify-center items-center px-4 py-1 duration-200 border rounded border-gray-700 text-sm font-normal cursor-pointer ${
            isGenerateTab && activeStyle
          }`}
        >
          Generate
        </div>
        <div
          onClick={() => handleCustomTab('inpainting')}
          className={`min-w-[100px] flex justify-center items-center px-4 py-1 duration-200 border rounded border-gray-700 text-sm font-normal cursor-pointer ${
            isInpaintingTab && activeStyle
          }`}
        >
          Inpainting
        </div>
        <div
          onClick={() => handleCustomTab('variation')}
          className={`min-w-[100px] flex justify-center items-center px-4 py-1 duration-200 border rounded border-gray-700 text-sm font-normal cursor-pointer ${
            isVariationTab && activeStyle
          }`}
        >
          Variation
        </div>
      </div>

      {isGenerateTab && (
        <PromptPanel
          tab={tab}
          images={images}
          handleImage={handleImage}
          handleLoading={handleLoading}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
          prompt={prompt}
          handlePrompt={handlePrompt}
          searchImages={searchImages}
          handleSearchImage={handleSearchImage}
          filter={filter}
          handleFilter={handleFilter}
          selectImage={selectImage}
          handleSelectImage={handleSelectImage}
        />
      )}
      {isInpaintingTab && (
        <InpaintingPanel
          tab={tab}
          images={images}
          selectImage={selectImage}
          handleSelectImage={handleSelectImage}
          handleImage={handleImage}
          handleLoading={handleLoading}
          isGenerating={isGenerating}
          prompt={prompt}
          handlePrompt={handlePrompt}
          filter={filter}
          handleFilter={handleFilter}
        />
      )}

      {isVariationTab && (
        <VariationPanel
          tab={tab}
          images={images}
          selectImage={selectImage}
          handleSelectImage={handleSelectImage}
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
