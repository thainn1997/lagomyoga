'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IClassProps, IClassTableFilters, IClassTableFilterValue } from 'src/types/class';

import ClassTableRow from './class-table-row';
import ClassTableToolbar from './class-table-toolbar';
import ClassTableFiltersResult from './class-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'title', label: 'Lớp học' },
  { id: 'teacher', label: 'Giáo viên', width: 160 },
  { id: 'date_created', label: 'Ngày tạo lớp', width: 160 },
  { id: 'day', label: 'Ngày học', width: 120 },
  { id: 'time_shift.start_time', label: 'Bắt đầu', width: 120 },
  { id: 'time_shift.end_time', label: 'Kết thúc', width: 120 },
  { id: '', width: 50 },
];

const defaultFilters: IClassTableFilters = {
  title: '',
  status: 'Published',
};

type IProps = {
  classList: IClassProps[];
  user: any;
  teachers: any;
};

// ----------------------------------------------------------------------

export default function ClassListView({ classList, user, teachers }: IProps) {
  const table = useTable();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState(classList);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  useEffect(() => {
    setTableData(classList);
  }, [classList]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IClassTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleSeeDetailClassRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.class.detail(id));
    },
    [router]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await axiosInstance.delete(`/items/class/${id}`);
        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
        enqueueSnackbar('Xoá thành công', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Xoá không thành công', { variant: 'error' });
        console.log(error);
      }
    },
    [dataInPage.length, table, tableData, enqueueSnackbar]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Card>
      <ClassTableToolbar filters={filters} onFilters={handleFilters} />

      {canReset && (
        <ClassTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <ClassTableRow
                    key={row.id}
                    row={row}
                    index={index}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleSeeDetailClassRow(row.id)}
                    user={user}
                    teachers={teachers}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IClassProps[];
  comparator: (a: any, b: any) => number;
  filters: IClassTableFilters;
}) {
  const { title, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (title) {
    inputData = inputData.filter(
      (user) => user.title.toLowerCase().indexOf(title.toLowerCase()) !== -1
    );
  }

  if (status !== 'Published') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
