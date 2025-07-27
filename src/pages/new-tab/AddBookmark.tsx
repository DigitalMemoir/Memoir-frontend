import clsx from 'clsx';
import { motion } from 'framer-motion';
import { bookmarkBaseStyle } from './BookmarkStyle.module';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Portal from '../../components/Portal';
import textStyles from '../../styles/textStyles';
import axiosInstance from '../../lib/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  showErrorToast,
  showSuccessToast,
} from '../../components/Toast/showToast';

const AddBookmark = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const buttonBaseStyle = clsx(
    'max-w-[144px] max-h-[54px] w-[7.6vw] h-[5.1vw] min-w-[80px] min-h-[24px] rounded-full',
    'flex flex-col items-center justify-center',
    'hover:cursor-pointer',
    textStyles.text1
  );
  const linkValidationRegex =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w- ./?%&=]*)?$/;

  const handleSubmit = async () => {
    await axiosInstance.post('/api/bookmarks', {
      url: url.trim(),
    });
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      setOpenModal(false);
      setUrl('');
      setError(false);
      showSuccessToast('북마크를 추가했어요.');
      queryClient.invalidateQueries({
        queryKey: ['bookmarks'],
      });
    },
    onError: (error) => {
      console.error(
        '북마크 생성에 실패하였습니다. 다시 시도하여주세요.',
        error
      );
      showErrorToast('북마크를 추가하지 못했어요.\n다시 시도해주세요.');
      setError(true);
    },
  });

  const validateLink = (url: string) => {
    if (linkValidationRegex.test(url) && url.length <= 300 && url.length > 0) {
      return true;
    }
    return false;
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setUrl('');
    setError(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (validateLink(e.target.value)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <motion.button
        aria-label="Add Bookmark"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpenModal(true)}
        className={clsx(
          bookmarkBaseStyle,
          'flex flex-col justify-center items-center box-border'
        )}
      >
        <PlusIcon className={'w-full h-full text-gray-2'} aria-hidden="true" />
      </motion.button>
      <Portal>
        {openModal && (
          <div
            aria-hidden
            onClick={() => setOpenModal(false)}
            className={
              'fixed top-0 left-0 w-screen h-screen bg-black/50 z-1000'
            }
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                if (!error && validateLink(url)) {
                  mutate();
                }
              }}
              className={clsx(
                'w-[52vw] h-fit min-w-[600px] p-10 bg-white rounded-[20px] shadow-button-2',
                'fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-1001'
              )}
            >
              <h3 className={clsx(textStyles.title3_1, 'mb-16')}>
                북마크 등록
              </h3>
              <div className="flex flex-col gap-4 w-full mb-14">
                <label htmlFor="url-input" className={clsx(textStyles.text1)}>
                  URL
                </label>
                <input
                  id="url-input"
                  value={url}
                  onChange={onInputChange}
                  type="url"
                  maxLength={300}
                  className={clsx(
                    'w-full h-[5vh] px-4 py-2 rounded-lg border border-gray-300',
                    textStyles.text1,
                    'focus:outline-none focus:border-primary-300'
                  )}
                  required
                />
                <span
                  className={clsx(
                    textStyles.text2,
                    'text-red-500',
                    error ? 'block' : 'hidden',
                    'pl-0.5'
                  )}
                >
                  유효하지 않은 URL입니다. 올바른 URL을 입력해주세요.
                </span>
              </div>
              <div className="flex flex-row justify-center gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleModalClose}
                  type="button"
                  className={clsx(
                    buttonBaseStyle,
                    'text-primary-300 border border-primary-300'
                  )}
                >
                  취소
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={error}
                  className={clsx(
                    buttonBaseStyle,
                    'disabled:text-text-subtle disabled:bg-gray-0',
                    'text-white bg-primary-400'
                  )}
                >
                  완료
                </motion.button>
              </div>
            </form>
          </div>
        )}
      </Portal>
    </>
  );
};

export default AddBookmark;
