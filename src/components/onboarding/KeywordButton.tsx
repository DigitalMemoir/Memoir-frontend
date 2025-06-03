import textStyles from '../../styles/textStyles';

const KeywordButton = ({
  icon,
  keyword,
  onClick,
  selected = false,
}: {
  icon: string;
  keyword: string;
  onClick?: () => void;
  selected?: boolean;
}) => {
  const selectedStyle =
    'bg shadow-[0px_0px_10px_0px_rgba(163,167,255,0.40)] bg-[linear-gradient(180deg,_#fff_0%,_#eeefff_100%)]';
  const unselectedStyle = 'bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)]';

  return (
    <button
      className={`btn btn-outline w-[280px] h-auto aspect-[28/18] box-border p-8 rounded-[20px] border-0 \
        ${selected ? selectedStyle : unselectedStyle}`}
      onClick={onClick}
    >
      <div
        className={`flex flex-col items-start gap-4 w-full h-full justify-start ${textStyles.title2}`}
      >
        <span className={'inline-block'}>{icon}</span>
        <p>{keyword}</p>
      </div>
    </button>
  );
};

export default KeywordButton;
