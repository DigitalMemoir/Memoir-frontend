import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import textStyles from '../../styles/textStyles';
import type React from 'react';
import { useRef } from 'react';

const GoogleSearchBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const baseStyles = 'w-full max-w-[50vw] min-w-[600px] h-[5vw] min-h-25 ';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputRef.current?.value.trim() !== '') {
        goToGoogle();
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputRef.current?.value.trim() !== '') {
      goToGoogle();
    }
  };

  const goToGoogle = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(inputRef.current?.value.trim() || '')}`;
    if (searchUrl) {
      window.location.href = searchUrl; // Redirect to Google search
    }
  };

  return (
    <form
      className={`relative ${baseStyles} py-6 px-10
        flex items-center justify-between bg-white rounded-full
        `}
      onSubmit={handleSubmit}
    >
      <img src={'/googleIcon.svg'} className={'w-16 h-16 z-10'} />
      <input
        onKeyDown={handleKeyDown}
        type={'search'}
        ref={inputRef}
        className={`absolute top-0 left-0 right-0 bottom-0 
          ${baseStyles} rounded-[50px] shadow-button-2
          pl-33 pr-27 py-4
          focus:outline focus:ring-2 focus:ring-primary-200 focus:shadow-select-1
          ${textStyles.title3_1} text-text-title `}
      />
      <button
        type={'submit'}
        className={
          'flex items-center justify-center p-3 rounded-full  hover:bg-[#efefef] z-10'
        }
      >
        <MagnifyingGlassIcon className={'w-10 h-10 text-gray-2'} />
      </button>
    </form>
  );
};

export default GoogleSearchBar;
