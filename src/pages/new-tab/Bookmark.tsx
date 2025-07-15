import clsx from 'clsx';
import { motion } from 'framer-motion';
import { bookmarkBaseStyle } from './BookmarkStyle.module';
import { getURLFavicon } from '../../utils/getURLFavicon';

const Bookmark = ({ href }: { href: string }) => {
  const faviconUrl = getURLFavicon(href);
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        bookmarkBaseStyle,
        'flex flex-col justify-center items-center box-border'
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
  );
};

export default Bookmark;
