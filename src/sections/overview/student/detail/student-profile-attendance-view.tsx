'use client';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import _ from 'lodash';

import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { Schedule } from 'src/types/receipt';
import { IClassProps, IClassWithAttendances } from 'src/types/class';

import ProfileTableRowView from '../../profile/profile-table-attendance-view';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'title', label: 'Lớp học' },
  { id: 'start_time', label: 'Bắt đầu', width: 120 },
  { id: 'end_time', label: 'Kết thúc', width: 120 },
  { id: 'date_created', label: 'Ngày học', width: 120 },
  { id: 'type', label: '', width: 120 },
];

type IProps = {
  currentAttandance: IClassWithAttendances[];
  schedule: Schedule[];
  dataClass: IClassProps[];
};
//--------------------------------------------------------

export default function StudentProfileAttendanceView({
  currentAttandance,
  schedule,
  dataClass,
}: IProps) {
  const table = useTable();
  const denseHeight = table.dense ? 52 : 72;

  const sheduleDateClass: {
    date_created: string;
    dayOfWeek: string;
    classId: IClassProps | undefined;
    useId: string;
  }[] = [];

  schedule.forEach((item) => {
    const classId = dataClass.find((element) => item.classId === element.id);
    item.data.map((date) =>
      sheduleDateClass.push({
        date_created: date.date,
        dayOfWeek: date.dayOfWeek,
        classId,
        useId: item.userId,
      })
    );
  });

  const coverScheduleDateClass = sheduleDateClass.map((item) => {
    const [day, month, year] = item.date_created.split('-');
    const dateISO = `${year}-${month}-${day}T00:00:00.000Z`;
    return {
      ...item,
      date_created: new Date(dateISO).toISOString(),
    };
  });

  const scheduleDateIsPast = coverScheduleDateClass.filter((item) => {
    const current = new Date();
    const itemDate = new Date(item.date_created);
    return itemDate <= current;
  });

  const dataScheduleAttendace: any = [...currentAttandance, ...scheduleDateIsPast];

  const resultScheduleAttendace = _.chain(dataScheduleAttendace)
    .groupBy('date_created')
    .map((value, key) => ({
      date_created: key,
      schedule: value,
    }))
    .sort((a, b) => new Date(b.date_created).valueOf() - new Date(a.date_created).valueOf())
    .value();

  const notFound = resultScheduleAttendace.length === 0;

  return (
    <Card sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={resultScheduleAttendace.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) => table.onSelectAllRows(checked, [])}
            />

            <TableBody>
              {resultScheduleAttendace
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row: any, index: number) => (
                  <ProfileTableRowView key={index} row={row} index={index} />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, 0)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={resultScheduleAttendace.length}
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
