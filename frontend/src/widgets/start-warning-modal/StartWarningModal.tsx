import { Button, Group, Modal, Stack, Text } from '@mantine/core';

type Props = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  available: number;
  requested: number;
};

export const StartWarningModal = ({
  opened,
  onClose,
  onConfirm,
  available,
  requested,
}: Props): React.JSX.Element => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Вопросов меньше, чем вы заказывали"
      centered
      size="lg"
      styles={{ title: { fontSize: 18 } }}
    >
      <Stack gap="lg">
        <Text>
          По заданным фильтрам доступно только <b>{available}</b> из <b>{requested}</b>{' '}
          вопросов. Часть подходящих вопросов уже пройдена или не подходит под фильтры.
        </Text>

        <Group justify="flex-end">
          <Button
            variant="light"
            color="var(--soft-blue)"
            onClick={onClose}
            radius="md"
            size="md"
          >
            Вернуться к настройкам
          </Button>
          <Button color="var(--crocus-purple)" onClick={onConfirm} radius="md" size="md">
            Всё равно начать
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
