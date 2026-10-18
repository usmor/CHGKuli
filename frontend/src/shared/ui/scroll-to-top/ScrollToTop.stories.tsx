import { ScrollToTop } from './ScrollToTop';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ScrollToTop> = {
  title: 'Shared/ScrollToTop',
  component: ScrollToTop,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: () => React.JSX.Element): React.JSX.Element => (
      <div style={{ height: '200vh', padding: 20 }}>
        <p>Прокрутите вниз, чтобы увидеть кнопку «Наверх»</p>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ScrollToTop>;

export const Default: Story = {};
