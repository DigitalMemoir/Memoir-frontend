import BeatLoader from 'react-spinners/BeatLoader';

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className={'w-full h-full flex items-center justify-center'}>
      <BeatLoader loading={isLoading} color={'#8387ff'} />
    </div>
  );
};

export default Loading;
