import { Center, Loader } from '@mantine/core';

export const CustomLoader = (): React.JSX.Element => {
  return (
    <Center h={220}>
      <Loader color="var(--crocus-purple)" size="lg" />
    </Center>
  );
};
