import { Alert } from '@mantine/core';

type alertProps = {
  title: string;
  message: string;
};

export const CustomAlert = ({ title, message }: alertProps): React.JSX.Element => {
  return (
    <Alert color="var(--soft-blue)" title={title}>
      {message}
    </Alert>
  );
};
