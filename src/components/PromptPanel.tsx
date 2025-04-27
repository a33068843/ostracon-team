'use client';

import type React from 'react';

import { useState } from 'react';
import { Sparkles, Sliders, RefreshCw, ImageIcon } from 'lucide-react';
import type { GenerationParams } from '../Temptypes';
import { useTextToImage } from '../hooks/useTextToImage';
import { useInpainting } from '../hooks/useInpainting';
import { toast } from 'react-toastify';
import { AdvancedFilter, defaultFilter, ImageTypes } from '../types';
import { AdvancedSearch } from './AdvancedSearch';
import { AIOption } from '../App';
import { filterBase64 } from '../utils';
import { useSearch } from '../hooks/useSearch';

const IS_ONLINE = true;
interface PromptPanelProps {
  tab: AIOption;
  images?: ImageTypes[];
  handleImage: (value: ImageTypes[]) => void;
  handleLoading: (value: boolean) => void;
  prompt: string;
  handlePrompt: (value: string) => void;
  searchImages?: string[];
  handleSearchImage: (value: string[]) => void;
  filter: AdvancedFilter;
  handleFilter: (filter: AdvancedFilter) => void;
  selectImage: ImageTypes[];
  handleSelectImage: (value: ImageTypes[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGenerate: (prompt: string, params: Record<string, any>) => void;
  isGenerating: boolean;
}

const PromptPanel = ({
  tab,
  images = [],
  handleImage,
  handleLoading,
  prompt,
  handlePrompt,
  searchImages,
  handleSearchImage,
  filter,
  handleFilter,
  selectImage,
  handleSelectImage,
  onGenerate,
  isGenerating,
}: PromptPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const textToImageMutation = useTextToImage({
    options: {
      onStart: () => {
        handleLoading(true);
      },
      onSuccess: (data) => {
        handleLoading(false);
        handleImage(
          data.base64_images.map((item) => ({
            base64: item,
            prompt: data.prompt,
          }))
        );
        toast.success('🎨大藝術家，你成功了！', {});
      },
      onError: () => {
        handleLoading(false);
        toast.error('☠️助手出錯了ＱＱ');
      },
    },
  });
  const searchMutation = useSearch({
    options: {
      onSuccess: (data) => {
        handleSearchImage([...data.results[0].image_urls]);
        handlePrompt(data.optimized_prompt);
        toast.success('優化結果出爐啦');
      },
      onError: () => {
        toast.error('☠️助手出錯了ＱＱ');
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating && IS_ONLINE) {
      textToImageMutation.mutate({
        text: prompt,
        ...(selectImage.length === 1 && {
          conditionImage: filterBase64(selectImage[0].base64),
        }),
        options: {
          width: filter.width,
          height: filter.height,
          seed: filter.seed,
          cfgScale: filter.cfgScale,
          numberOfImages: filter.numberOfImages,
        },
        category: {
          ...filter.category,
        },
      });
    }
  };

  const handleOptimize = () => {
    if (searchMutation.isPending) return;
    const defaultCate = filter.category ?? {};
    const newText = `${prompt} ${(() => {
      return Object.entries(defaultCate)
        .filter((item) => !!item[1])
        .map((item) => {
          return `, ${item}`;
        })
        .join('');
    })()}`;
    searchMutation.mutate(newText);
  };
  const handleFilterChange = (name: keyof GenerationParams, value: unknown) => {
    handleFilter({ ...filter, [name]: value });
  };

  const generateRandomSeed = () => {
    handleFilterChange('seed', Math.floor(Math.random() * 1000000));
  };

  const handleDemo = () => {
    handlePrompt('a white computer case, with rgb fans');
    handleFilter(defaultFilter);
  };

  return (
    <>
      <h2 className='text-2xl font-bold mt-6 mb-2'>Create Image</h2>

      <form>
        <div className='mb-6'>
          <div className='flex justify-between'>
            <label htmlFor='prompt' className='block text-sm font-medium mb-2'>
              Prompt
            </label>
            <p
              className='text-sky-500 duration-200 hover:brightness-90 cursor-pointer active:brightness-80 select-none'
              onClick={handleDemo}
            >
              Demo
            </p>
          </div>
          <div className='relative'>
            <textarea
              id='prompt'
              value={prompt}
              onChange={(e) => handlePrompt(e.target.value)}
              placeholder='A futuristic cityscape with flying cars and neon lights...'
              className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]'
              required
            />
            <div className='absolute flex items-center justify-center gap-1 right-3 bottom-3'>
              <Sparkles
                onClick={handleOptimize}
                className={` text-gray-400 ${
                  searchMutation.isPending ? 'cursor-default' : 'cursor-pointer'
                }`}
                size={20}
                color={searchMutation.isPending ? '#8200da' : '#D1D5DB'}
              />
              {searchMutation.isPending && (
                <p className='text-purple-600'>Generating...</p>
              )}
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <button
            type='button'
            onClick={() => setShowAdvanced(!showAdvanced)}
            className='flex items-center gap-2 text-sm text-gray-300 hover:text-white'
          >
            <Sliders size={16} />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div className='space-y-4 mb-6 p-4 bg-gray-700 rounded-lg'>
            <div>
              <label htmlFor='width' className='block text-sm font-medium mb-1'>
                Width: {filter.width}px
              </label>
              <input
                type='range'
                id='width'
                min='256'
                max='1024'
                step='64'
                value={filter.width}
                onChange={(e) =>
                  handleFilterChange('width', Number(e.target.value))
                }
                className='w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer'
              />
            </div>

            <div>
              <label
                htmlFor='height'
                className='block text-sm font-medium mb-1'
              >
                Height: {filter.height}px
              </label>
              <input
                type='range'
                id='height'
                min='256'
                max='1024'
                step='64'
                value={filter.height}
                onChange={(e) =>
                  handleFilterChange('height', Number(e.target.value))
                }
                className='w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer'
              />
            </div>

            {/* <div>
              <label htmlFor='style' className='block text-sm font-medium mb-1'>
                Style
              </label>
              <select
                id='style'
                value={filter.style}
                onChange={(e) => handleFilterChange('style', e.target.value)}
                className='w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white'
              >
                <option value='photorealistic'>Photorealistic</option>
                <option value='anime'>Anime</option>
                <option value='digital-art'>Digital Art</option>
                <option value='oil-painting'>Oil Painting</option>
                <option value='watercolor'>Watercolor</option>
                <option value='pixel-art'>Pixel Art</option>
              </select>
            </div> */}

            <div>
              <label htmlFor='seed' className='block text-sm font-medium mb-1'>
                Seed (Optional)
              </label>
              <div className='flex gap-2'>
                <input
                  type='number'
                  id='seed'
                  value={filter.seed || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'seed',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder='Random'
                  className='flex-1 p-2 bg-gray-600 border border-gray-500 rounded-lg text-white'
                />
                <button
                  type='button'
                  onClick={generateRandomSeed}
                  className='p-2 bg-gray-600 border border-gray-500 rounded-lg hover:bg-gray-500'
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <AdvancedSearch
              tab={tab}
              filter={filter}
              handleFilter={handleFilter}
              selectImage={selectImage}
              handleSelectImage={handleSelectImage}
            />
          </div>
        )}

        <div className='flex gap-2'>
          <button
            type='submit'
            disabled={
              !prompt.trim() || searchMutation.isPending || isGenerating
            }
            onClick={(e) => handleSubmit(e)}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium ${
              !prompt.trim() || searchMutation.isPending || isGenerating
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className='animate-spin' size={20} />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon size={20} />
                Generate Image
              </>
            )}
          </button>
        </div>
      </form>

      <div className='mt-6 text-sm text-gray-400'>
        <p className='mb-2'>Tips:</p>
        <ul className='list-disc pl-5 space-y-1'>
          <li>Be specific about what you want to see</li>
          <li>Include details about style, lighting, and composition</li>
          <li>Use descriptive adjectives to guide the generation</li>
          <li>Specify camera angles or perspectives if relevant</li>
        </ul>
      </div>
    </>
  );
};

export default PromptPanel;
