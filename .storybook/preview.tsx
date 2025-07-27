import type { Preview } from '@storybook/react-vite';
import '../src/index.css';
import { HashRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import duration from 'dayjs/plugin/duration';
import { Toaster } from 'react-hot-toast';

dayjs.extend(duration);
dayjs.locale('ko');

// chart.ts (or main.ts)
import {
  Chart as ChartJS,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        desktopFHD: {
          name: 'Desktop FHD',
          styles: {
            width: '1920px',
            height: '1080px',
          },
          type: 'desktop',
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={'bg-white'}>
        <div id={'portal-root'} />
        <Toaster />
        <HashRouter>
          <Story />
        </HashRouter>
      </div>
    ),
  ],
};

export default preview;
