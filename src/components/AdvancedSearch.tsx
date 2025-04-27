import { ChangeEvent } from 'react';
import { AIOption } from '../App';
import { AdvancedFilter, ImageTypes } from '../types';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  cameraAngles,
  cameraTemplates,
  caseMaterials,
  colorsScheme,
  coolingMaterials,
  designStyles,
  lightingDesign,
} from '../assets/mock';

interface AdvancedSearchProps {
  tab: AIOption;
  filter: AdvancedFilter;
  handleFilter: (filter: AdvancedFilter) => void;
  selectImage: ImageTypes[];
  handleSelectImage: (value: ImageTypes[]) => void;
}
export const AdvancedSearch = (props: AdvancedSearchProps) => {
  const { tab, filter, handleFilter, selectImage, handleSelectImage } = props;

  const handleFilterChange = (
    name: keyof AdvancedFilter,
    value: unknown,
    key?: string
  ) => {
    if (name === 'category' && key) {
      const newCategory = {
        ...filter.category,
        [key]: value ?? '',
      };
      handleFilter({ ...filter, category: newCategory });
      return;
    }
    handleFilter({ ...filter, [name]: value });
  };
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          handleSelectImage([
            { base64: `${reader.result}`, prompt: '' },
            ...selectImage,
          ]);
        }
      };

      reader.onerror = () => {
        toast.error('出錯啦');
      };

      // 開始讀取檔案，並將其轉換為 Data URL (Base64 編碼)
      reader.readAsDataURL(imageFile);
    }
  };
  const handleDelete = (value: string) => {
    handleSelectImage(selectImage.filter((image) => image.base64 !== value));
  };

  const showUpload = (() => {
    if (tab === 'generateImage' && selectImage.length >= 1) return false;
    if (tab === 'inpainting' && selectImage.length >= 1) return false;
    if (tab === 'variation' && selectImage.length >= 5) return false;
    return true;
  })();

  return (
    <div>
      <div>
        <label className='block text-sm font-medium mb-3'>
          {(() => {
            if (tab === 'generateImage') return 'Condition Image (Max = 1)';
            if (tab === 'inpainting')
              return 'Condition Image (Max = 1, Min = 1)';
            if (tab === 'variation') return 'Condition Image (Max = 5)';
            return '';
          })()}
        </label>
        <div className='flex gap-2 flex-wrap'>
          {showUpload && (
            <div className='relative content flex items-center justify-center w-24 border-2 border-dashed border-white aspect-square'>
              <Upload />
              <label
                htmlFor='file_input'
                className='absolute w-full h-full flex-1'
              />
              <input
                type='file'
                id='file_input'
                accept='image/jpeg, image/png'
                onChange={handleUpload}
                className='hidden'
              />
            </div>
          )}
          {selectImage.length !== 0 && (
            <>
              {selectImage.map((image) => {
                return (
                  <div
                    key={image.base64}
                    className='relative content flex items-center justify-center w-24  aspect-square'
                  >
                    <X
                      color='black'
                      size={'20%'}
                      className='absolute -top-2 -right-2 rounded-full bg-white filter brightness-80 cursor-pointer hover:brightness-100 duration-200'
                      onClick={() => handleDelete(image.base64)}
                    />
                    <img
                      src={image.base64}
                      alt='ERROR'
                      className='w-full h-full object-contain'
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className='mt-4 mb-6'>
        <label htmlFor='cfgScale' className='block text-sm font-medium mb-1'>
          Cfg Scale: {filter.cfgScale}
        </label>
        <input
          type='range'
          id='cfgScale'
          min='1.1'
          max='10'
          step='0.01'
          value={filter.cfgScale}
          onChange={(e) =>
            handleFilterChange('cfgScale', Number(e.target.value))
          }
          className='w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer'
        />
      </div>

      <div className='mb-6'>
        <label htmlFor='cfgScale' className='block text-sm font-medium mb-1'>
          Number Of Images {filter.numberOfImages}
        </label>
        <input
          type='range'
          id='cfgScale'
          min='1'
          max='5'
          step='1'
          value={filter.numberOfImages}
          onChange={(e) =>
            handleFilterChange('numberOfImages', Number(e.target.value))
          }
          className='w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer'
        />
      </div>

      <div className='mt-4'>
        <label htmlFor='styles' className='block text-sm font-medium mb-1'>
          Design Styles
        </label>
        <select
          id='styles'
          value={filter.category?.designStyles}
          onChange={(e) =>
            handleFilterChange('category', e.target.value, 'designStyles')
          }
          className='w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white'
        >
          {designStyles.map((item) => {
            return (
              <option key={item.key} value={item.description}>
                {item.key}
              </option>
            );
          })}
        </select>
      </div>

      <div className='mt-4'>
        <label htmlFor='Material' className='block text-sm font-medium mb-1'>
          Case Material
        </label>
        <select
          id='Material'
          value={filter.category?.caseMaterials}
          onChange={(e) =>
            handleFilterChange('category', e.target.value, 'caseMaterials')
          }
          className='w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white'
        >
          {caseMaterials.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>

      <div className='mt-4'>
        <label
          htmlFor='coolingMaterials'
          className='block text-sm font-medium mb-1'
        >
          Cooling Materials
        </label>
        <select
          id='coolingMaterials'
          value={filter.category?.coolingMaterials}
          onChange={(e) =>
            handleFilterChange('category', e.target.value, 'coolingMaterials')
          }
          className='w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white'
        >
          {coolingMaterials.map((item) => {
            return (
              <option key={item.key} value={item.description}>
                {item.key}
              </option>
            );
          })}
        </select>
      </div>

      <div className='mt-4'>
        <label
          htmlFor='colorsScheme'
          className='block text-sm font-medium mb-1'
        >
          Colors Scheme
        </label>
        <select
          id='colorsScheme'
          value={filter.category?.colorsScheme}
          onChange={(e) =>
            handleFilterChange('category', e.target.value, 'colorsScheme')
          }
          className='w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white'
        >
          {colorsScheme.map((item) => {
            return (
              <option key={item.key} value={item.description}>
                {item.key}
              </option>
            );
          })}
        </select>
      </div>
      <div className='mt-4'>
        <label
          htmlFor='lightingDesign'
          className='block text-sm font-medium mb-1'
        >
          Lighting Design
        </label>
        <select
          id='lightingDesign'
          value={filter.category?.lightingDesign}
          onChange={(e) =>
            handleFilterChange('category', e.target.value, 'lightingDesign')
          }
          className='w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white'
        >
          {lightingDesign.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className='mt-4'>
        <label
          htmlFor='cameraTemplates'
          className='block text-sm font-medium mb-1'
        >
          Camera Angles
        </label>
        <select
          id='cameraTemplates'
          value={filter.category?.cameraTemplates}
          onChange={(e) =>
            handleFilterChange('category', e.target.value, 'cameraTemplates')
          }
          className='w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white'
        >
          {cameraTemplates.map((item) => {
            return (
              <option key={item.key} value={item.description}>
                {item.key}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
