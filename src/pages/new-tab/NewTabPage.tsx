import { useEffect } from 'react';
import AddBookmark from './AddBookmark';
import Bookmark from './Bookmark';
import { useAuthStore } from '../../states/useAuthStore';
import axiosInstance from '../../lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';

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

  console.log('Bookmarks:', bookmarks);
  if (error) {
    console.error('Error fetching bookmarks:', error);
    return <div>Error loading bookmarks</div>;
  }
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
      </div>
    </div>
  );
};

export default NewTabPage;
