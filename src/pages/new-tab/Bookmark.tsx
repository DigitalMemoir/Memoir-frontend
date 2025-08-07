import clsx from 'clsx';
import { motion } from 'framer-motion';
import { bookmarkBaseStyle } from './BookmarkStyle.module';
import { getURLFavicon } from '../../utils/getURLFavicon';
import textStyles from '../../styles/textStyles';
import { useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  showErrorToast,
  showSuccessToast,
} from '../../components/Toast/showToast';

const Bookmark = ({ href }: { href: string }) => {
  const [showDelBtn, setShowDelBtn] = useState(false);
  const faviconUrl = getURLFavicon(href);
  const handleHover = () => setShowDelBtn(true);
  const handleLeave = () => setShowDelBtn(false);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    await axiosInstance.delete(`/api/bookmarks`, {
      data: { url: href },
    });
  };

  const { mutate } = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      showSuccessToast('북마크를 삭제했어요.');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error) => {
      showErrorToast('북마크를 삭제하지 못했어요.\n다시 시도해주세요.');
      console.error('북마크 삭제 실패:', error);
    },
  });

  return (
    <motion.div
      className={'flex flex-col items-center justify-center gap-6'}
      onHoverStart={handleHover}
      onHoverEnd={handleLeave}
    >
      <motion.a
        href={href}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          bookmarkBaseStyle,
          'flex flex-col justify-center items-center box-border hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,0.15)]'
        )}
      >
        <img
          src={faviconUrl}
          alt={`${href} favicon`}
          className={'w-full h-full object-cover'}
          loading={'lazy'}
          draggable={'false'}
        />
      </motion.a>
      {showDelBtn && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={clsx(
            textStyles.text1,
            'text-center rounded-[20px] py-1 xl:py-2 w-[5vw] max-w-[96px] min-w-[60px]',
            'text-text-subtle bg-gray-0 break-keep'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => mutate()} // 임시 코드
        >
          삭제
        </motion.button>
      )}
    </motion.div>
  );
};

export default Bookmark;
