import React from 'react';

import { StyledInputBase } from './style';

import {
  Select,
  FormControl,
  Chip,
  FormControlProps,
  Box,
  SelectChangeEvent,
} from '@mui/material';

export type Props = FormControlProps & {
  children: React.ReactNode;
  selectedNames: string[] | string;
  setSelectedNames: React.Dispatch<React.SetStateAction<string | string[]>>;
  label: string;
};

export default function MultiSelect({
  children,
  label,
  selectedNames,
  setSelectedNames,
}: Props) {
  return (
    <FormControl sx={{ width: '100%' }}>
      <label>
        {label}
        <span>*</span>
      </label>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={selectedNames}
        onChange={(e: SelectChangeEvent<typeof selectedNames>) =>
          setSelectedNames(e.target.value)
        }
        input={<StyledInputBase id="select-multiple-chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {Array.isArray(selected) &&
              selected.map((value) => (
                <Chip
                  key={value}
                  label={value === 'agricultor' ? 'vendedor' : value}
                />
              ))}
          </Box>
        )}
      >
        {children}
      </Select>
    </FormControl>
  );
}
