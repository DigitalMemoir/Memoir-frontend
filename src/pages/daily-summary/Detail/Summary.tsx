import Contents from './Contents';
import SummaryImage from '../../../assets/icons/summary.png';
import clsx from 'clsx';
import textStyles from '../../../styles/textStyles';

const Summary = ({ summary }: { summary: string }) => {
  return (
    <Contents icon={SummaryImage} title={'요약 문장'}>
      <p
        className={clsx(textStyles.text2, 'text-text-body')}
      >{`"${summary}"`}</p>
    </Contents>
  );
};

export default Summary;
