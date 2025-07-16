import clsx from 'clsx';
import { motion } from 'framer-motion';
import { bookmarkBaseStyle } from './BookmarkStyle.module';
import { getURLFavicon } from '../../utils/getURLFavicon';
import textStyles from '../../styles/textStyles';
import { useState } from 'react';

const Bookmark = ({ href }: { href: string }) => {
  const [showDelBtn, setShowDelBtn] = useState(false);
  const faviconUrl = getURLFavicon(href);
  const handleHover = () => setShowDelBtn(true);
  const handleLeave = () => setShowDelBtn(false);
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
          onClick={() => window.open(href, '_blank')} // 임시 코드
        >
          삭제
        </motion.button>
      )}
    </motion.div>
  );
};

export default Bookmark;
