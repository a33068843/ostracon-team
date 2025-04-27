import { Download, Maximize, X } from 'lucide-react';
import Modal from 'react-modal';
import { use, useState } from 'react';
import { useTextToImage } from '../hooks/useTextToImage';
import { ImageTypes } from '../types';
import { toast } from 'react-toastify';
import { useVariation } from '../hooks/useVariation';
import { useSearch } from '../hooks/useSearch';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('body');

interface ImageDisplayProps {
  images: ImageTypes[];
  isLoading: boolean;
  selectImage: ImageTypes[];
  handleSelectImage: (value: ImageTypes[]) => void;
  searchImages?: string[];
  handleSearchImage: (value: string[]) => void;
}

const ImageDisplay = ({
  images,
  isLoading,
  selectImage,
  handleSelectImage,
  searchImages = [],
  handleSearchImage,
}: ImageDisplayProps) => {
  const [target, setTarget] = useState('');

  const handleDownload = (name: string, image: string) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = image; // 或者使用 base64Data 如果你在 state 中管理
    downloadLink.download = name;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const handleExpand = (image: string) => {
    setTarget(image);
  };

  return (
    <div className='w-full md:w-2/3 h-full overflow-auto p-6 border-r border-gray-700'>
      <h2 className='text-2xl font-bold mb-6'>Current Generate</h2>

      {isLoading && (
        <div className='flex flex-col items-center justify-center p-8 border border-gray-700 rounded-lg bg-gray-800 mb-6 '>
          <div className='w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4'></div>
          <p className='text-gray-400'>Generating your masterpiece...</p>
        </div>
      )}
      {!isLoading && images.length === 0 && (
        <div className='flex flex-col items-center justify-center h-128 p-8 border border-gray-700 rounded-lg bg-gray-800 aspect-square'>
          <p className='text-gray-400 text-center mb-4'>
            No images generated yet
          </p>
          <p className='text-gray-500 text-center'>
            Enter a prompt on the right panel to create your first image
          </p>
        </div>
      )}
      {!isLoading && images.length > 0 && (
        <div className='flex flex-col items-center justify-center p-8 border border-gray-700 rounded-lg bg-gray-800 mb-6 '>
          <img src={`data:image/png;base64,${images[0].base64}`} />
        </div>
      )}

      <h2 className='text-2xl font-bold mb-6 mt-6'>Search Result</h2>
      {searchImages.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {searchImages.map((image, index) => {
            const imageURL = `${image}`;
            // const imageURL = `${image}`;
            const isSelect = selectImage
              .map(({ base64 }) => base64)
              .includes(imageURL);
            return (
              <div
                key={image}
                onClick={() => {
                  if (isSelect) {
                    handleSelectImage(
                      selectImage.filter((select) => select.base64 !== imageURL)
                    );
                    return;
                  }
                  handleSelectImage([
                    { base64: imageURL, prompt: '' },
                    ...selectImage,
                  ]);
                }}
                className='relative group cursor-pointer'
              >
                <img
                  src={imageURL}
                  alt='ERROR'
                  className={`w-full aspect-square object-cover rounded-lg border border-gray-700 bg-gray-800 ${
                    isSelect && `border-2 border-orange-400`
                  }`}
                />
                <div className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex items-end justify-end opacity-0 group-hover:opacity-100 p-2'>
                  <div className='flex gap-2'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(`${index}`, imageURL);
                      }}
                      className='p-2 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer'
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpand(imageURL);
                      }}
                      className='p-2 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer'
                    >
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h2 className='text-2xl font-bold mb-6 mt-6'>Generated Images</h2>

      {images.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {images.map((image, index) => {
            const imageURL = `data:image/png;base64,${image.base64}`;
            // const imageURL = `${image}`;
            const isSelect = selectImage
              .map(({ base64 }) => base64)
              .includes(imageURL);
            return (
              <div
                key={image.base64}
                onClick={() => {
                  if (isSelect) {
                    handleSelectImage(
                      selectImage.filter((select) => select.base64 !== imageURL)
                    );
                    return;
                  }
                  handleSelectImage([
                    { ...image, base64: imageURL },
                    ...selectImage,
                  ]);
                }}
                className='relative group cursor-pointer'
              >
                <img
                  src={imageURL}
                  alt='ERROR'
                  className={`w-full aspect-square object-cover rounded-lg border border-gray-700 bg-gray-800 ${
                    isSelect && `border-2 border-orange-400`
                  }`}
                />
                <div className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex items-end justify-end opacity-0 group-hover:opacity-100 p-2'>
                  <div className='flex gap-2'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(`${index}`, imageURL);
                      }}
                      className='p-2 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer'
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpand(imageURL);
                      }}
                      className='p-2 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer'
                    >
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal
        isOpen={!!target}
        onRequestClose={() => setTarget('')}
        style={customStyles}
        contentLabel='Example Modal'
        className={'customModal'}
        overlayClassName={'customModalOverlay'}
      >
        <X
          onClick={() => setTarget('')}
          className='absolute top-0 right-0 cursor-pointer'
          color='black'
        />
        <img
          src={target ?? ''}
          // alt={image.prompt}
          className='w-full max-w-lg aspect-square object-contain rounded bg-white'
        />
      </Modal>
    </div>
  );
};

export default ImageDisplay;
