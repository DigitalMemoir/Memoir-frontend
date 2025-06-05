import AddBookmark from './AddBookmark';
import Bookmark from './Bookmark';
import GoogleSearchBar from './GoogleSearchBar';

const NewTabPage = () => {
  const bookmarks = [
    'https://www.google.com',
    'https://www.youtube.com',
    'https://www.github.com',
    'https://www.notion.so',
    'https://www.wikipedia.org',
  ];
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
        {bookmarks.map((bookmark, index) => (
          <Bookmark key={index} href={bookmark} />
        ))}
        {bookmarks.length <= 8 && <AddBookmark />}
      </div>
    </div>
  );
};

export default NewTabPage;
