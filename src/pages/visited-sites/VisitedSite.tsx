import clsx from 'clsx';
import textStyles from '../../styles/textStyles';
import { getURLFavicon } from '../../utils/getURLFavicon';

const VisitedSite = ({ domain, title }: { domain: string; title: string }) => {
  const faviconUrl = getURLFavicon(domain);

  return (
    <a className={'flex flex-row justify-start items-center gap-4 flex-nowrap'}>
      <img
        src={faviconUrl}
        alt={`${domain} favicon`}
        className={'w-[28px] h-[28px] object-cover overflow-hidden'}
        loading={'lazy'}
        draggable={'false'}
      />
      <span className={clsx(textStyles.title3, 'text-text-body')}>{title}</span>
      <span className={clsx(textStyles.title3_1, 'text-text-subtle')}>
        {domain}
      </span>
    </a>
  );
};

export default VisitedSite;
