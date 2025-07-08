import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import textStyles from '../styles/textStyles';
import type React from 'react';
import { useRef } from 'react';
import googleIcon from '../assets/icons/googleIcon.svg';

const GoogleSearchBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const baseStyles =
    'w-[51vw] max-w-[978px] min-w-[600px] h-[5vw] min-h-[68.7px] rounded-full ';

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
        flex items-center justify-between bg-white 
        `}
      onSubmit={handleSubmit}
    >
      <img
        src={googleIcon}
        className={'w-[3.33vw] min-w-10 h-auto aspect-square z-10'}
      />
      <input
        onKeyDown={handleKeyDown}
        type={'search'}
        ref={inputRef}
        className={`absolute top-0 left-0 right-0 bottom-0 
          ${baseStyles} rounded-[50px] shadow-button-2
          pl-33 pr-27 py-4
          focus:outline-0 focus:shadow-button-2
          ${textStyles.title3_1} text-text-title `}
      />
      <button
        type={'submit'}
        className={
          'flex items-center justify-center p-3 rounded-full  hover:bg-[#efefef] z-10'
        }
      >
        <MagnifyingGlassIcon
          className={
            'w-[3.7vw] max-w-10 min-w-6 h-auto aspect-square text-gray-2'
          }
        />
      </button>
    </form>
  );
};

export default GoogleSearchBar;
