import { useAutoComplete } from '@shared/lib/hooks';
import { useState } from 'react';

import { AutoCompleteUI } from './AutoCompleteUI';

import type { AutoCompleteType, SearchItem } from '@shared/types';

type AutoCompleteProps = {
  type: AutoCompleteType;
  value: SearchItem[];
  onChange: (items: SearchItem[]) => void;
  placeholder?: string;
};

export const AutoComplete = ({
  type,
  value,
  onChange,
  placeholder,
}: AutoCompleteProps): React.JSX.Element => {
  const [query, setQuery] = useState('');
  const { data: suggestions = [] } = useAutoComplete(type, query);


  const allItems = [...value, ...suggestions];

  const uniqueItems = Array.from(
    new Map(allItems.map((item) => [item.id, item])).values(),
  );

  const data = suggestions.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const selectedIds = value.map((item) => String(item.id));

  const handleChange = (ids: string[]): void => {
    const items = ids
      .map((id) => uniqueItems.find((s) => String(s.id) === id))
      .filter((item): item is SearchItem => Boolean(item));

    onChange(items);
  };

  return (
    <AutoCompleteUI
      data={data}
      value={selectedIds}
      onChange={handleChange}
      onSearchChange={setQuery}
      placeholder={placeholder}
      type={type}
    />
  );
};
