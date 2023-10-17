import React from 'react';
import {
  Select,
  FormControl,
  SelectChangeEvent,
  FormControlProps,
} from '@mui/material';
import { StyledInputBase } from './style';

export type Props = FormControlProps & {
  children: React.ReactNode;
  selectedNames: any;
  setSelectedNames: React.Dispatch<React.SetStateAction<any>>;
  label: string;
};

export default function MuiSelect({
  children,
  label,
  selectedNames,
  setSelectedNames,
}: any) {
  return (
    <FormControl>
      <label>
        {label}
        <span>*</span>
      </label>

      <Select
        value={selectedNames}
        onChange={(e: any) => setSelectedNames(e.target.value)}
        displayEmpty
        input={<StyledInputBase />}
      >
        {children}
      </Select>
    </FormControl>
  );
}
