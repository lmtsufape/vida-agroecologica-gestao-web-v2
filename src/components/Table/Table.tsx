'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import Input from '@/components/Input';
import S from './styles.module.scss';
import Button from '@/components/Button';
import Loader from '@/components/Loader';

const TableView = ({ data, columns }: Record<any, any>) => {
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

  if (data.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <Input
        name="search"
        placeholder="Buscar"
        type="text"
        value={query}
        onChange={(e: any) => setQuery(e.target.value)}
      />
      <div className={S.tableContainer}>
        <table style={{ minWidth: '1300px' }}>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
