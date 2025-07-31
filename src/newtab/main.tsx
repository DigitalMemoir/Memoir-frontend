import { createRoot } from 'react-dom/client';
import '../index.css';
import App from './App.tsx';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.locale('ko');
dayjs.tz.setDefault('Asia/Seoul');

createRoot(document.getElementById('root')!).render(<App />);
