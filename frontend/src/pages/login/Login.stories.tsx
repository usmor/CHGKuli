import { useForm } from '@mantine/form';
import { fn } from 'storybook/test';

import { LoginUI, type LoginFormValues } from './LoginUI';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof LoginUI> = {
  title: 'Pages/Login',
  component: LoginUI,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof LoginUI>;

type WrapperProps = {
  serverError?: string | null;
  isSubmitting?: boolean;
  initialValues?: LoginFormValues;
};

const Wrapper = ({
  serverError = null,
  isSubmitting = false,
  initialValues = { email: '', password: '' },
}: WrapperProps): React.JSX.Element => {
  const form = useForm<LoginFormValues>({
    initialValues,
  });

  return (
    <LoginUI
      form={form}
      serverError={serverError}
      isSubmitting={isSubmitting}
      onSubmit={fn()}
    />
  );
};

export const Default: Story = {
  render: () => <Wrapper />,
};

export const Filled: Story = {
  render: () => (
    <Wrapper initialValues={{ email: 'test@example.com', password: 'secret1234' }} />
  ),
};

export const WithError: Story = {
  render: () => (
    <Wrapper
      serverError="Неверный email или пароль"
      initialValues={{ email: 'test@example.com', password: 'wrongpass' }}
    />
  ),
};

export const Submitting: Story = {
  render: () => (
    <Wrapper
      isSubmitting
      initialValues={{ email: 'test@example.com', password: 'secret1234' }}
    />
  ),
};
