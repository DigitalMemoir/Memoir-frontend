import type { Preview } from '@storybook/react-vite';
import '../src/index.css';
import { HashRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

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
        <HashRouter>
          <Story />
        </HashRouter>
      </div>
    ),
  ],
};

export default preview;
