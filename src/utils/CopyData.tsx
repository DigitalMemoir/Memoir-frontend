import { useCallback, useState } from 'react';
import { showErrorToast } from '../components/Toast/showToast';

export default function CopyVisitedPagesButton() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = useCallback(() => {
    const oneDayAgo = Date.now() - 1000 * 60 * 60 * 24;

    chrome.history.search(
      {
        text: '',
        startTime: oneDayAgo,
        maxResults: 100,
      },
      (results) => {
        try {
          const json = JSON.stringify(results, null, 2);

          navigator.clipboard
            .writeText(json)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
              setError('클립보드 복사 실패');
              showErrorToast(
                '방문 기록을 클립보드에 복사하지 못했어요.\n다시 시도해주세요.'
              );
              console.error(err);
            });
        } catch (e) {
          setError('JSON 변환 실패');
          console.error(e);
        }
      }
    );
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCopy}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        방문기록 JSON 복사
      </button>
      {copied && <span className="text-green-600 text-sm">✅ 복사 완료!</span>}
      {error && <span className="text-red-500 text-sm">❌ {error}</span>}
    </div>
  );
}
