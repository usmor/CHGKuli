import { BannerUI } from './BannerUI';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof BannerUI> = {
  title: 'Widgets/Banner/BannerUI',
  component: BannerUI,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof BannerUI>;

export const Default: Story = {};
