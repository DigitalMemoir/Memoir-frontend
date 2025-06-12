import AddBookmark from './AddBookmark';
import Bookmark from './Bookmark';

const NewTabPage = () => {
  const bookmarks = [
    'https://www.google.com',
    'https://www.youtube.com',
    'https://www.github.com',
    'https://www.notion.so',
    'https://www.wikipedia.org',
  ];

  const extras = Array.from({
    length: bookmarks.length < 5 ? 5 - bookmarks.length : 0,
  });
  return (
    <div className={'flex flex-col items-center justify-start h-full pt-20'}>
      <div
        className={
          'flex flex-row flex-wrap justify-between \
          w-full max-w-[978px] min-w-[600px]\
          '
        }
      >
        {bookmarks.map((bookmark, index) => (
          <Bookmark key={index} href={bookmark} />
        ))}
        {bookmarks.length <= 5 && <AddBookmark />}
        {extras.map((_, index) => (
          <div key={index} aria-hidden className={'w-24 h-24'} />
        ))}
      </div>
    </div>
  );
};

export default NewTabPage;
