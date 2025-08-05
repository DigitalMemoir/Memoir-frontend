import clsx from 'clsx';
import './App.css';
import MemoirLogoRounded from '../assets/icons/memoir-logo-rounded.svg';

function App() {
  return (
    <div
      className={clsx('flex flex-col items-center justify-center h-75 w-50 ')}
    >
      <img
        src={MemoirLogoRounded}
        alt="Memoir Logo"
        className="w-24 h-24 mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">Memoir</h1>
      <p className="text-gray-600 text-center mb-4">
        웹 기록으로 정리하는
        <br />
        오늘 하루, 나의 회고록
      </p>
      <p>v1.0.2</p>
    </div>
  );
}

export default App;
