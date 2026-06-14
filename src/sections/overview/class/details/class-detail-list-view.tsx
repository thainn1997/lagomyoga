'use client';

import { useState, useCallback } from 'react';

import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IStudentTableFilters } from 'src/types/student';
import { IClassProps, IDirectusUser, IClassTableFilterValue } from 'src/types/class';

import ClassDetailRow from './class-detail-table-row';
import ClassDetailHeadView from './class-detail-head-view';
import ClassDetailSrearchToolbar from './class-detail-search-toolbar';

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'title', label: 'Danh sách học viên' },
  { id: 'day_studies', label: 'Các buổi học', width: 120 },
  { id: '', width: 88 },
];

type IProps = {
  dataTable: IClassProps;
  user: any;
};

const defaultFilters: IStudentTableFilters = {
  first_name: '',
  last_name: '',
  status: 'Published',
};

// ----------------------------------------------------------------------

export default function ClassDetailListView({ dataTable, user }: IProps) {
  const { students, id } = dataTable;

  const studentsFilter = students.filter(
    (item) =>
      item?.directus_users_id !== null &&
      item?.directus_users_id?.id !== null &&
      item?.directus_users_id?.first_name !== null &&
      item?.directus_users_id?.last_name !== null
  );

  const [filters, setFilters] = useState(defaultFilters);

  const table = useTable();

  const dataFiltered = applyFilter({
    inputData: studentsFilter,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 52 : 72;

  const notFound = !dataFiltered.length;

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

  return (
    <>
      <Box sx={{ pt: { xs: 2, sm: 5 }, px: { xs: 2, sm: 5 } }}>
        <ClassDetailHeadView dataHead={dataTable} user={user} />
      </Box>
      <ClassDetailSrearchToolbar filters={filters} onFilters={handleFilters} />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={studentsFilter.length}
              numSelected={table.selected.length}
            />

            <TableBody>
              <>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <ClassDetailRow
                      dataTable={dataTable}
                      key={row.directus_users_id.id + index}
                      row={row}
                      index={index}
                      idParams={id}
                      user={user}
                    />
                  ))}
              </>

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, studentsFilter.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <TablePaginationCustom
        count={students.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IDirectusUser[];
  comparator: (a: any, b: any) => number;
  filters: IStudentTableFilters;
}) {
  const { first_name, status, last_name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (first_name) {
    inputData = inputData.filter(
      (user) =>
        user.directus_users_id.first_name.toLowerCase().indexOf(first_name.toLowerCase()) !== -1
    );
  }

  if (last_name) {
    inputData = inputData.filter(
      (user) =>
        user.directus_users_id.last_name.toLowerCase().indexOf(last_name.toLowerCase()) !== -1
    );
  }

  if (status !== 'Published') {
    inputData = inputData.filter((user) => user.directus_users_id.status === status);
  }

  return inputData;
}
