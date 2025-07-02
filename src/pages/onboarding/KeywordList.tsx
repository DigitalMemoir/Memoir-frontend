import { keywords } from './keywords';
import KeywordButton from './KeywordButton';

const KeywordList = ({
  setSelected,
  selected,
}: {
  setSelected: React.Dispatch<React.SetStateAction<Array<string>>>;
  selected: Array<string>;
}) => {
  const handleKeywordClick = (type: string) => {
    setSelected((prev) => {
      if (prev.includes(type)) {
        return prev.filter((i) => i !== type); // 이미 선택된 경우 선택 해제
      } else {
        return [...prev, type]; // 새로 선택된 경우 추가
      }
    });
  };

  return (
    <div
      className={
        'grid grid-cols-3 items-center justify-start gap-8 w-full h-full'
      }
    >
      {keywords.map((keyword) => (
        <KeywordButton
          key={keyword.keyword}
          icon={keyword.icon}
          keyword={keyword.keyword}
          selected={selected.includes(keyword.type)}
          onClick={() => handleKeywordClick(keyword.type)}
        />
      ))}
    </div>
  );
};

export default KeywordList;
