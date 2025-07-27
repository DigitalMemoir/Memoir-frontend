import { createRoot } from 'react-dom/client';
import '../index.css';
import App from './App.tsx';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.locale('ko');

createRoot(document.getElementById('root')!).render(<App />);
