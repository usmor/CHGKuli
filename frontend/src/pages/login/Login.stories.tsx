import { fn } from 'storybook/test';

import { LoginUI } from './LoginUI';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof LoginUI> = {
  title: 'Pages/Login/LoginUI',
  component: LoginUI,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof LoginUI>;

export const Default: Story = {
  args: {
    email: '',
    password: '',
    error: null,
    isSubmitting: false,
    onEmailChange: fn(),
    onPasswordChange: fn(),
    onSubmit: (e) => e.preventDefault(),
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    email: 'test@example.com',
    password: 'wrongpass',
    error: 'Неверный email или пароль',
  },
};

export const Submitting: Story = {
  args: {
    ...Default.args,
    email: 'test@example.com',
    password: 'secret1234',
    isSubmitting: true,
  },
};
