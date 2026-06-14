import useSWR from 'swr';
import { m } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { fetcher } from 'src/utils/axios';

import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { MotionContainer } from 'src/components/animate';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IClassTableFilterValue } from 'src/types/class';
import { IStudentUser, IStudentTableFilters } from 'src/types/student';

import StudentTableRow from './student-table-row';
import StudentTableToolbar from './student-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'last_name', label: 'Tên' },
  { id: 'email', label: 'Email', width: 200 },
  { id: 'day', label: 'Chức vụ', width: 120 },
  { id: '', width: 50 },
];

const defaultFilters: IStudentTableFilters = {
  first_name: '',
  last_name: '',
  status: 'Published',
};

type IProps = {
  studentList: IStudentUser[];
  user: any;
};

// ----------------------------------------------------------------------

export default function StudentListView({ studentList, user }: IProps) {
  const table = useTable();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState(studentList);

  const { mutate } = useSWR('/users', fetcher);

  const { mutate: mutateClass } = useSWR(
    `/items/class?fields=*,time_shift.*,students.directus_users_id.*`,
    fetcher
  );

  const [filters, setFilters] = useState(defaultFilters);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  useEffect(() => {
    setTableData(studentList);
  }, [studentList]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

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

  const handleSeeDetailStudentRow = useCallback(
    (id: string) => {
      if (user?.role !== 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad') return;
      router.push(paths.dashboard.student.detail(id));
    },
    [router, user?.role]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await axiosInstance.delete(`/users/${id}`);
        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        mutate();
        mutateClass();
        table.onUpdatePageDeleteRow(dataInPage.length);
        enqueueSnackbar('Xoá thành công', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Xoá không thành công', { variant: 'success' });
      }
    },
    [dataInPage.length, table, tableData, enqueueSnackbar, mutate, mutateClass]
  );

  return (
    <MotionContainer>
      <m.div>
        <Card>
          <StudentTableToolbar filters={filters} onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
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
                      <StudentTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleSeeDetailStudentRow(row.id)}
                        user={user}
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
      </m.div>
    </MotionContainer>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IStudentUser[];
  comparator: (a: any, b: any) => number;
  filters: IStudentTableFilters;
}) {
  const { last_name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (last_name) {
    inputData = inputData.filter(
      (user) => user.last_name.toLowerCase().indexOf(last_name.toLowerCase()) !== -1
    );
  }

  if (status !== 'Published') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
