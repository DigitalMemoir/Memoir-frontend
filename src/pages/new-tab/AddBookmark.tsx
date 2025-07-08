import clsx from 'clsx';
import { motion } from 'framer-motion';
import { bookmarkBaseStyle } from './BookmarkStyle.module';
import { PlusIcon } from '@heroicons/react/24/solid';

const AddBookmark = () => {
  return (
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        bookmarkBaseStyle,
        'flex flex-col justify-center items-center box-border'
      )}
    >
      <PlusIcon className={'w-full h-full text-gray-2'} aria-hidden="true" />
    </motion.a>
  );
};

export default AddBookmark;
