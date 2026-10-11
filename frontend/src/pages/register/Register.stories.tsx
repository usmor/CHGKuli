import { useForm } from '@mantine/form';
import { fn } from 'storybook/test';

import { RegisterUI, type RegisterFormValues } from './RegisterUI';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof RegisterUI> = {
  title: 'Pages/Register',
  component: RegisterUI,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof RegisterUI>;

type WrapperProps = {
  serverError?: string | null;
  isSubmitting?: boolean;
  initialValues?: RegisterFormValues;
};

const Wrapper = ({
  serverError = null,
  isSubmitting = false,
  initialValues = { email: '', username: '', password: '' },
}: WrapperProps): React.JSX.Element => {
  const form = useForm<RegisterFormValues>({
    initialValues,
  });

  return (
    <RegisterUI
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
    <Wrapper
      initialValues={{
        email: 'test@example.com',
        username: 'testuser',
        password: 'secret1234',
      }}
    />
  ),
};

export const WithServerError: Story = {
  render: () => (
    <Wrapper
      serverError="Пользователь с таким email или username уже существует"
      initialValues={{
        email: 'test@example.com',
        username: 'testuser',
        password: 'secret1234',
      }}
    />
  ),
};

export const Submitting: Story = {
  render: () => (
    <Wrapper
      isSubmitting
      initialValues={{
        email: 'test@example.com',
        username: 'testuser',
        password: 'secret1234',
      }}
    />
  ),
};
