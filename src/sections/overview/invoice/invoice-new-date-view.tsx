'use client';

import dayjs from 'dayjs';

import {
  Card,
  Grid,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  ListItemText,
  TableContainer,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';

import { IReceipt } from 'src/types/receipt';

// const ROLE_STUDENT = 'b49dda8a-60a9-44b5-9d88-9b0db3480741';

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'name', label: 'Họ và tên' },
  { id: 'start_date', label: 'Ngày bắt đầu' },
  { id: 'end_date', label: 'Ngày kết thúc' },
  { id: 'total_sessions', label: 'Số buổi học' },
  { id: 'amount_received', label: 'Học phí' },
];

// ----------------------------------------------------------------------

export default function InvoiceNewDateView({ data }: { data: IReceipt[] }) {
  return (
    <Grid container spacing={2} sx={{ mt: 6 }}>
      <Grid item xs={12} md={12}>
        <Card sx={{ shadow: 'none' }}>
          <Typography sx={{ my: 2, mx: 2 }} variant="h6">
            Hoá đơn kì sắp tới
          </Typography>
          <List studentList={data} />
        </Card>
      </Grid>
    </Grid>
  );
}

//---------------------------------------------------------------------

const List = ({ studentList }: { studentList: IReceipt[] }) => {
  const table = useTable();

  const denseHeight = table.dense ? 52 : 72;
  return (
    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
      <Scrollbar>
        <Table size={table.dense ? 'small' : 'medium'}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={studentList?.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
          />
          <TableBody>
            {(studentList || [])
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row: IReceipt, index) => (
                <InvoiceTableRow key={row.id} row={row} index={index} />
              ))}

            <TableEmptyRows
              height={denseHeight}
              emptyRows={emptyRows(table.page, table.rowsPerPage, studentList?.length)}
            />

            <TableNoData notFound={studentList?.length === 0} />
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
};

//---------------------------------------------------------------------

function InvoiceTableRow({ row, index }: { row: IReceipt; index: number }) {
  const { first_name, last_name, email } = row.student;

  const { end_date, start_date, amount_received, total_sessions } = row;
  const newDate = dayjs(end_date).add(1, 'day').format('DD-MM-YYYY');

  const quickEdit = useBoolean();

  return (
    <TableRow hover component="tr" onClick={quickEdit.onTrue}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color={(index + 1 && 'info') || 'default'} sx={{ fontSize: 14 }}>
          {index + 1}
        </Label>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={last_name[0]} sx={{ mr: 2 }}>
          {last_name[0].toLocaleUpperCase()}
        </Avatar>
        <div>
          <ListItemText
            primary={
              <strong>
                {` ${first_name}
                  ${last_name}`}
              </strong>
            }
            primaryTypographyProps={{
              typography: 'body2',
              whiteSpace: 'nowrap',
            }}
          />
          <Typography variant="body2">{email}</Typography>
        </div>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={(start_date && 'warning') || 'default'}
          sx={{ fontSize: 14, fontWWight: 'medium' }}
        >
          {newDate}
        </Label>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={(end_date && 'warning') || 'default'}
          sx={{ fontSize: 14, fontWWight: 'medium' }}
        >
          {dayjs(newDate).add(4, 'week').format('DD-MM-YYYY')}
        </Label>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color="default" sx={{ fontSize: 14, fontWWight: 'medium' }}>
          {total_sessions}
        </Label>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={(amount_received && 'secondary') || 'default'}
          sx={{ fontSize: 14 }}
        >
          {fCurrency(amount_received)} VND
        </Label>
      </TableCell>
    </TableRow>
  );
}
