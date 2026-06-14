'use client';

import { Box, Card, Table, TableBody, Typography, TableContainer } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import TeacherTableRow from './teacher-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'teacher', label: 'Tên giáo viên' },
  { id: 'title', label: 'Lớp' },
  { id: 'time_shift', label: 'Thời gian' },
  { id: 'attendance', label: 'Ngày điểm danh' },
];

type IProps = {
  result: any;
};

// ----------------------------------------------------------------------

export default function TeacherListView({ result }: IProps) {
  const table = useTable();

  const { first_name, last_name, avatar } = result;

  const denseHeight = table.dense ? 52 : 72;

  const notFound = !result?.attendance?.length;

  return (
    <Card sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ my: 2, mx: 2, fontSize: 16 }} variant="body1">
          <strong>Giáo viên</strong> : <strong>{` ${first_name} ${last_name}`}</strong>
        </Typography>
        <Typography sx={{ my: 2, mx: 2, fontSize: 14 }} variant="body1">
          Số buổi : {result?.attendance?.length}
        </Typography>
      </Box>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={result?.attendance?.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  (result?.attendance || []).map((row: any) => row.user_created)
                )
              }
            />

            <TableBody>
              {(result?.attendance || [])
                ?.sort((a: any, b: any) => a.date_created_day - b.date_created_day)
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row: any, index: any) => (
                  <TeacherTableRow
                    key={row.user_created + index}
                    row={row}
                    index={index}
                    firstName={first_name}
                    lastName={last_name}
                    avatar={avatar}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, result?.attendance?.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={result?.attendance?.length}
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
