import React from 'react';

import { StyledInputBase } from './style';

import {
  Select,
  FormControl,
  SelectChangeEvent,
  FormControlProps,
} from '@mui/material';

export type Props = FormControlProps & {
  children: React.ReactNode;
  selectedNames: number | string;
  setSelectedNames: React.Dispatch<React.SetStateAction<number>>;
  label: string;
};

export default function MuiSelect({
  children,
  label,
  selectedNames,
  setSelectedNames,
}: Props) {
  return (
    <FormControl fullWidth>
      <label>
        {label}
        <span>*</span>
      </label>

      <Select
        value={selectedNames ? selectedNames.toString() : ''}
        onChange={(e: SelectChangeEvent) =>
          setSelectedNames(Number(e.target.value))
        }
        displayEmpty
        input={<StyledInputBase />}
      >
        {children}
      </Select>
    </FormControl>
  );
}
