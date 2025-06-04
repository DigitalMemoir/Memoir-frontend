import { keywords } from './keywords';
import KeywordButton from './KeywordButton';
import { useState } from 'react';

const KeywordList = () => {
  const [selected, setSelected] = useState(-1);

  const handleKeywordClick = (index: number) => {
    setSelected(index);
  };

  return (
    <div
      className={
        'flex flex-row items-center justify-start gap-8 w-full h-full \
        flex-wrap'
      }
    >
      {keywords.map((keyword, idx) => (
        <KeywordButton
          key={keyword.keyword}
          icon={keyword.icon}
          keyword={keyword.keyword}
          selected={selected === idx}
          onClick={() => handleKeywordClick(idx)}
        />
      ))}
    </div>
  );
};

export default KeywordList;
