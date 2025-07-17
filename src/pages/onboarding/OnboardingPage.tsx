import { ChevronRightIcon } from '@heroicons/react/24/solid';
import textStyles from '../../styles/textStyles';
import KeywordList from './KeywordList';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import axiosInstance from '../../lib/axiosInstance';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../states/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from '../../components/Toast/showToast';

const OnboardingPage = () => {
  const [selected, setSelected] = useState<Array<string>>([]);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    login();
  }, []);

  const handleSetKeywords = async () => {
    await axiosInstance.post('/api/users/category', {
      interests: selected,
    });
  };

  const { mutate } = useMutation({
    mutationFn: handleSetKeywords,
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.error('Error setting keywords:', error);
      showErrorToast('키워드 설정에 실패했어요.\n다시 시도해주세요.');
    },
  });

  return (
    <AnimatePresence>
      <div
        className={
          'flex flex-row items-center justify-between max-w-[85vw] mx-auto h-dvh'
        }
      >
        <div
          className={
            'w-full h-fit flex flex-col items-start justify-center gap-[9.63vh]'
          }
        >
          <div
            className={'flex flex-col items-start justify-center gap-[1.48vh]'}
          >
            <h2 className={`${textStyles.title1} `}>
              어떤 목적으로 웹을 사용하시나요?
            </h2>
            <p className={`${textStyles.sub1} `}>
              Memoir가 그 흔적을 담아, 하루를 이야기로 정리해드릴게요.
            </p>
          </div>
          <div className={'mb-[100px]'}>
            <KeywordList setSelected={setSelected} selected={selected} />
          </div>
        </div>
        {selected.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'w-[8.33vw] h-auto aspect-square rounded-full flex-shrink-0 bg-white shadow-button-2 box-border',
              'flex flex-row items-center justify-center',
              'hover:cursor-pointer hover:bg-gray-1/20'
            )}
            onClick={() => {
              if (selected.length === 0) {
                alert('최소 하나의 키워드를 선택해주세요.');
                return;
              }
              mutate();
            }}
          >
            <ChevronRightIcon className={'h-[3.7vh] inline-block'} />
          </motion.button>
        )}
      </div>
    </AnimatePresence>
  );
};

export default OnboardingPage;
