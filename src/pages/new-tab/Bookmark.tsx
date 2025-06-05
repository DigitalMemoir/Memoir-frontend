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
      className={'inline w-fit h-fit p-8 shadow-default-1 rounded-full '}
    >
      <img
        src={faviconUrl}
        alt={`${href} favicon`}
        className={'w-16 h-16 rounded-full'}
        loading={'lazy'}
        draggable={'false'}
      />
    </motion.a>
  );
};

export default Bookmark;
