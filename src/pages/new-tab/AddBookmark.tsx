import { motion } from 'framer-motion';

const AddBookmark = () => {
  return (
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={
        'w-24 h-24 shadow-default-1 rounded-full p-8 \
    flex flex-col justify-center items-center box-border'
      }
    >
      <svg
        xmlns={'http://www.w3.org/2000/svg'}
        width={'44'}
        height={'44'}
        viewBox={'0 0 44 44'}
        fill={'none'}
      >
        <path
          d={'M2 22H42'}
          stroke={'#CCCCCC'}
          stroke-width={'3'}
          stroke-linecap={'round'}
        />
        <path
          d={'M22.3077 2V42'}
          stroke={'#CCCCCC'}
          stroke-width={'3'}
          stroke-linecap={'round'}
        />
      </svg>
    </motion.a>
  );
};

export default AddBookmark;
