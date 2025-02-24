'use client';

import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';

import Search from '../Search';

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

interface TableViewProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

const TableView = <T,>({ data, columns }: TableViewProps<T>) => {
  const [query, setQuery] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter: query,
    },
    onGlobalFilterChange: setQuery,
    initialState: {
      sorting: [
        {
          id: 'id',
          desc: true,
        },
      ],
      pagination: {
        pageSize: 50,
      },
    },
  });

  return (
    <div>
      <div className={S.tableContainer}>
        <div className={S.tableWrapper}>
          <Search value={query} onChange={setQuery} />
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
          onClick={() => {
            if (table.getCanNextPage()) {
              table.nextPage();
            }
          }}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default TableView;
