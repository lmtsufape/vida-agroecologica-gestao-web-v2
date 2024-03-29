'use client';

import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

type Column = {
  header: string;
  accessorKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell?: (info: any) => JSX.Element;
};

type TableViewProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  columns: Column[];
};

const TableView = ({ data, columns }: TableViewProps) => {
  const [query, setQuery] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: query,
    },
    onGlobalFilterChange: setQuery,
  });

  return (
    <div>
      <Input
        name="search"
        placeholder="Buscar"
        type="text"
        value={query}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => setQuery(e.target.value)}
      />
      <div className={S.tableContainer}>
        <div className={S.tableWrapper}>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={S.buttons}>
        <Button
          dataType="filled"
          type="button"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Anterior
        </Button>
        <Button
          dataType="filled"
          type="button"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default TableView;
