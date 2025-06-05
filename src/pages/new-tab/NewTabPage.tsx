import Bookmark from './Bookmark';
import GoogleSearchBar from './GoogleSearchBar';

const NewTabPage = () => {
  return (
    <div className={'flex flex-col items-center justify-center h-dvh gap-12'}>
      <GoogleSearchBar />
      <div
        className={
          'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 \
          gap-x-4 gap-y-12 w-full max-w-[50vw] min-w-[600px] \
          justify-items-center'
        }
      >
        <Bookmark href={'https://www.google.com'} />
        <Bookmark href={'https://www.youtube.com'} />
        <Bookmark href={'https://www.github.com'} />
        <Bookmark href={'https://www.notion.so'} />
        <Bookmark href={'https://www.wikipedia.org'} />
      </div>
    </div>
  );
};

export default NewTabPage;
