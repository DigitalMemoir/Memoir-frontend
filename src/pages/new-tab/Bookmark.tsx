import clsx from 'clsx';
import { motion } from 'framer-motion';
import { bookmarkBaseStyle } from './BookmarkStyle.module';

const Bookmark = ({ href }: { href: string }) => {
  const isExtension = window.location.protocol === 'chrome-extension:';
  const faviconUrl = isExtension
    ? `chrome://favicon2/?size=64&pageUrl=${encodeURIComponent(href)}`
    : `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(href)}`;
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
