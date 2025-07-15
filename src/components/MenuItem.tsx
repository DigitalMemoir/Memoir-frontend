import { Link } from 'react-router-dom';
import textStyles from '../styles/textStyles';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);

const MenuItem = ({
  icon,
  title,
  endpoint,
  selected,
}: {
  icon: string;
  title: string;
  endpoint: string;
  selected?: boolean;
}) => {
  const baseStyles =
    'w-[12.08vw] h-auto aspect-[29/8] min-w-[182px] rounded-2xl p-4 flex flex-row items-center justify-start gap-4 ';
  const selectedStyles = `bg-primary-100/50 text-primary-400 ${textStyles.title3} break-keep`;
  const unselectedStyles = `text-text-body ${textStyles.title3_1}`;

  const styles = selected ? selectedStyles : unselectedStyles;

  return (
    <MotionLink
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      to={selected ? '/' : endpoint}
      className={baseStyles + styles}
    >
      <img src={icon} className={'w-4 h-4'} />
      <span>{title}</span>
    </MotionLink>
  );
};

export default MenuItem;
