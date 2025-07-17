import { useEffect } from 'react';
import AddBookmark from './AddBookmark';
import Bookmark from './Bookmark';
import { useAuthStore } from '../../states/useAuthStore';
import axiosInstance from '../../lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { bookmarkBaseStyle } from './BookmarkStyle.module';
import { showErrorToast } from '../../components/Toast/showToast';

const NewTabPage = () => {
  const { login } = useAuthStore();

  const getBookmarks = async (): Promise<Array<string>> => {
    const res = await axiosInstance.get('/api/bookmarks');
    return res.data.data;
  };

  const {
    data: bookmarks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    login();
  }, []);

  if (isLoading || !bookmarks) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error fetching bookmarks:', error);
    showErrorToast('북마크를 불러오지 못했어요.\n다시 시도해주세요.');
    return <div>Error loading bookmarks</div>;
  }

  const extras = Array.from({
    length: bookmarks.length < 5 ? 5 - bookmarks.length : 0,
  });

  return (
    <div className={'flex flex-col items-center justify-start h-full pt-20'}>
      <div
        className={
          'flex flex-row flex-wrap justify-between items-start \
          w-full max-w-[978px] min-w-[600px]\
          '
        }
      >
        {bookmarks.length > 0 &&
          bookmarks.map((bookmark, index) => (
            <Bookmark key={index} href={bookmark} />
          ))}
        {bookmarks.length <= 5 && <AddBookmark />}
        {extras.map((_, index) => (
          <div
            key={index}
            aria-hidden
            className={`${bookmarkBaseStyle} bg-transparent shadow-none`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewTabPage;
