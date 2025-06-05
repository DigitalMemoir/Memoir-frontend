import { motion } from 'framer-motion';

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
      className={
        'w-24 h-24 shadow-default-1 rounded-full p-8 \
        flex flex-col justify-center items-center box-border'
      }
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
