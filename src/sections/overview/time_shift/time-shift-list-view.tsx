import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { Stack, Button } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { ITimeShift } from 'src/types/time-shift';

import TimeShiftTableRow from './time-shift-table-row';
import TimeShiftFormCreateView from './time-shift-form-create-view';

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'start_time', label: 'Bắt đầu' },
  { id: 'end_time', label: 'Kết thúc' },
  { id: '', width: 80 },
];

type IProps = {
  data: ITimeShift[];
  user: any;
};

//-----------------------------------------------------

export default function TimeShiftListView({ data, user }: IProps) {
  const table = useTable();

  const create = useBoolean();

  const denseHeight = table.dense ? 52 : 72;

  const notFound = !data.length;

  return (
    <>
      <Card
      //  sx={{ maxWidth: 480 }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ my: 2, mx: 2 }} variant="h6">
            Khung giờ
          </Typography>
          {user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={create.onTrue}
              sx={{ height: 36, mr: 2, my: 2 }}
            >
              Tạo mới
            </Button>
          )}
        </Stack>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    data.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {[...data]
                  .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <TimeShiftTableRow key={row.id} row={row} index={index} user={user} />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={data.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
      <TimeShiftFormCreateView open={create.value} onClose={create.onFalse} />
    </>
  );
}
