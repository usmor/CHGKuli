import { useState } from 'react';

import { AutoCompleteUI } from './AutoCompleteUI';

import type { Meta, StoryObj } from '@storybook/react-vite';

import '@mantine/core/styles.css';

const meta: Meta<typeof AutoCompleteUI> = {
  title: 'Feature/AutoCompleteUI',
  component: AutoCompleteUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: () => React.JSX.Element): React.JSX.Element => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AutoCompleteUI>;

const authorsData = [
  { value: '1', label: 'Юлия Дидбаридзе' },
  { value: '2', label: 'Григорий Зырянов' },
  { value: '3', label: 'Фёдор Журавлёв' },
  { value: '4', label: 'Михаил Калашников' },
  { value: '5', label: 'Алексей Рабин' },
];

const tournamentsData = [
  { value: '1', label: 'Синхронный турнир «Что-то вроде»' },
  { value: '2', label: 'Кубок Москвы по ЧГК. Гран-При 2009/10' },
  { value: '3', label: 'Открытый кубок Мордовии' },
  { value: '4', label: 'Чемпионат Канады' },
  { value: '5', label: 'Молодёжный Кубок мира. Сезон 2020' },
];

type WrapperProps = {
  type: 'authors' | 'tournaments';
  data: { value: string; label: string }[];
  initialValue?: string[];
  placeholder?: string;
};

const Wrapper = ({
  type,
  data,
  initialValue = [],
  placeholder,
}: WrapperProps): React.JSX.Element => {
  const [value, setValue] = useState<string[]>(initialValue);

  return (
    <AutoCompleteUI
      type={type}
      data={data}
      value={value}
      onChange={setValue}
      onSearchChange={console.log}
      placeholder={placeholder}
    />
  );
};

export const Authors: Story = {
  render: () => (
    <Wrapper type="authors" data={authorsData} placeholder="Найти автора..." />
  ),
};

export const AuthorsWithSelected: Story = {
  render: () => (
    <Wrapper
      type="authors"
      data={authorsData}
      initialValue={['1', '2']}
      placeholder="Найти автора..."
    />
  ),
};

export const Tournaments: Story = {
  render: () => (
    <Wrapper type="tournaments" data={tournamentsData} placeholder="Найти турнир..." />
  ),
};

export const TournamentsWithSelected: Story = {
  render: () => (
    <Wrapper
      type="tournaments"
      data={tournamentsData}
      initialValue={['1', '2', '3']}
      placeholder="Найти турнир..."
    />
  ),
};

export const Empty: Story = {
  render: () => <Wrapper type="authors" data={[]} placeholder="Ничего не найдено..." />,
};

export const ManySelected: Story = {
  render: () => (
    <Wrapper
      type="authors"
      data={authorsData}
      initialValue={authorsData.map((a) => a.value)}
      placeholder="Все выбраны..."
    />
  ),
};
