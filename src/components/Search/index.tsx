import React from 'react';
import { FiSearch } from 'react-icons/fi';

import S from './styles.module.scss';

import Input from '@/components/Input';

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const Search: React.FC<SearchProps> = ({ value, onChange }) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  return (
    <div className={S.searchContainer}>
      <Input
        name="search"
        placeholder="Buscar"
        type="text"
        value={value}
        onChange={handleChange}
      />
      <div className={S.searchIconContainer}>
        <FiSearch className={S.searchIcon} />
      </div>
    </div>
  );
};

export default Search;
