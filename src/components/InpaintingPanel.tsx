import { useState } from 'react';
import { Sparkles, Sliders, RefreshCw, ImageIcon } from 'lucide-react';
import { useInpainting } from '../hooks/useInpainting';
import { AdvancedFilter, ImageTypes } from '../types';
import { AdvancedSearch } from './AdvancedSearch';
import { AIOption } from '../App';
import { toast } from 'react-toastify';

const IS_ONLINE = true;

interface InpaintingPanelProps {
  tab: AIOption;
  images?: ImageTypes[];
  handleImage: (value: ImageTypes[]) => void;
  handleLoading: (value: boolean) => void;
  isGenerating: boolean;
  prompt: string;
  handlePrompt: (value: string) => void;
  selectImage: ImageTypes[];
  handleSelectImage: (value: ImageTypes[]) => void;
  filter: AdvancedFilter;
  handleFilter: (filter: AdvancedFilter) => void;
}

export const InpaintingPanel = ({
  tab,
  images = [],
  handleImage,
  handleLoading,
  isGenerating,
  prompt,
  handlePrompt,
  selectImage,
  handleSelectImage,
  filter,
  handleFilter,
}: InpaintingPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const inpaintingMutation = useInpainting({
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
        toast.success('🎨大藝術家，你成功了！');
      },
      onError: () => {
        handleLoading(false);
        toast.error('☠️助手出錯了ＱＱ');
      },
    },
  });

  const handleInpaintingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_ONLINE) {
      inpaintingMutation.mutate({
        text: prompt,
        image: selectImage[0].base64,
        negativeText: filter.negativeText ?? '',
        maskPrompt: filter.maskPrompt ?? '',
        options: {
          width: filter.width,
          height: filter.height,
          seed: filter.seed,
          cfgScale: filter.cfgScale,
          numberOfImages: filter.numberOfImages,
        },
      });
    }
  };

  const handleFilterChange = (name: keyof AdvancedFilter, value: unknown) => {
    handleFilter({ ...filter, [name]: value });
  };

  const generateRandomSeed = () => {
    handleFilterChange('seed', Math.floor(Math.random() * 1000000));
  };

  return (
    <>
      <h2 className='text-2xl font-bold mt-6 mb-2'>Inpainting Image</h2>

      <form>
        <div className='mb-6'>
          <label htmlFor='prompt' className='block text-sm font-medium mb-2'>
            Prompt
          </label>
          <div className='relative'>
            <textarea
              id='prompt'
              value={prompt}
              onChange={(e) => handlePrompt(e.target.value)}
              placeholder='A futuristic cityscape with flying cars and neon lights...'
              className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]'
              required
            />
            <Sparkles
              className='absolute right-3 bottom-3 text-gray-400'
              size={20}
            />
          </div>
        </div>

        <div className='mb-6'>
          <label htmlFor='prompt' className='block text-sm font-medium mb-2'>
            Mask Prompt
          </label>
          <div className='relative'>
            <textarea
              id='mask prompt'
              value={filter.maskPrompt ?? ''}
              onChange={(e) => handleFilterChange('maskPrompt', e.target.value)}
              placeholder='A futuristic cityscape with flying cars and neon lights...'
              className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]'
              required
            />
            <Sparkles
              className='absolute right-3 bottom-3 text-gray-400'
              size={20}
            />
          </div>
        </div>

        <div className='mb-6'>
          <label htmlFor='prompt' className='block text-sm font-medium mb-2'>
            Negative Text
          </label>
          <div className='relative'>
            <input
              id='negative text'
              value={filter.negativeText ?? ''}
              onChange={(e) =>
                handleFilterChange('negativeText', e.target.value)
              }
              className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 '
              required
            />
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
            disabled={!prompt.trim() || isGenerating}
            onClick={(e) => handleInpaintingSubmit(e)}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium ${
              !prompt.trim() || isGenerating
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
                Inpainting Image
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
