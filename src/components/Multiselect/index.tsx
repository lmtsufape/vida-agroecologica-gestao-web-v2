import React from 'react';
import {
  Select,
  FormControl,
  Stack,
  Chip,
  FormControlProps,
} from '@mui/material';

import { IoCloseOutline as CancelIcon } from 'react-icons/io5';
import { StyledInputBase } from './style';

export type Props = FormControlProps & {
  children: React.ReactNode;
  selectedNames: string[];
  setSelectedNames: React.Dispatch<React.SetStateAction<any[]>>;
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
        value={selectedNames}
        onChange={(e: any) => setSelectedNames(e.target.value)}
        input={<StyledInputBase placeholder="Presidentes" />}
        renderValue={(selected) => (
          <Stack gap={1} direction="row" flexWrap="wrap">
            {selected.map((value: any) => (
              <Chip
                key={value}
                label={value}
                onDelete={() =>
                  setSelectedNames(
                    selectedNames.filter((item: number) => item !== value),
                  )
                }
                deleteIcon={
                  <CancelIcon
                    onMouseDown={(event: any) => event.stopPropagation()}
                  />
                }
              />
            ))}
          </Stack>
        )}
      >
        {children}
      </Select>
    </FormControl>
  );
}
