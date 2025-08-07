import dayjs from 'dayjs';
import { getBrowsingHistory } from '../../utils/getBrowsingHistory';
import VisitedSite from './VisitedSite';
import { useEffect, useState } from 'react';
import type { IVisitedPage } from '../../types/IVisitedPages';

const VisitedSites = () => {
  const [historyData, setHistoryData] = useState<Array<IVisitedPage>>([]);

  useEffect(() => {
    const date = dayjs().format('YYYY-MM-DD');
    getBrowsingHistory(date).then((data) => setHistoryData(data.slice(0, 6)));
  }, []);

  if (historyData.length === 0) {
    return <div className={'text-text-subtle'}>No visited sites found.</div>;
  }

  return (
    <div className={'flex flex-col gap-8 pt-20'}>
      {historyData.map((page, index) => (
        <>
          <VisitedSite
            key={page.url}
            domain={new URL(page.url).hostname}
            title={page.title}
          />
          {index < historyData.length - 1 && <hr className={'border-gray-2'} />}
        </>
      ))}
    </div>
  );
};

export default VisitedSites;
