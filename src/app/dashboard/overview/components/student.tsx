'use client';

import useSWR from 'swr';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';

import Container from '@mui/material/Container';
import {
  Card,
  Grid,
  Table,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  ListItemText,
  TableContainer,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import { sendMailReceipt } from 'src/sendmail';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';

import { NotFoundView } from 'src/sections/error';
import ReceiptCreateCardView from 'src/sections/overview/receipt/create/receipt-create-form-view';

import { IReceipt, IStudentWithReceipt } from 'src/types/receipt';

// const ROLE_STUDENT = 'b49dda8a-60a9-44b5-9d88-9b0db3480741';

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'name', label: 'Họ và tên' },
  { id: 'start_date', label: 'Ngày bắt đầu' },
  { id: 'end_date', label: 'Ngày kết thúc' },
  { id: 'total_sessions', label: 'Số buổi học' },
  { id: 'amount_received', label: 'Học phí' },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------

export default function StudentOverview() {
  const settings = useSettingsContext();

  const filter = {
    _and: [
      { end_date: { _lte: '$NOW' } },
      { end_date: { _gte: '$NOW(-3 day)' } },
      { status: { _eq: 'published' } },
    ],
  };

  const { data, error, isLoading } = useSWR(
    `/items/receipt?fields=*,student.*&filter=${JSON.stringify(filter)}`
  );

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <Grid container spacing={2} sx={{ mt: 6 }}>
        <Grid item xs={12} md={12}>
          <Card sx={{ shadow: 'none' }}>
            <Typography sx={{ my: 2, mx: 2 }} variant="h6">
              Học sinh gần hết hạn
            </Typography>
            <List studentList={data} />
          </Card>
        </Grid>
      </Grid>
    </Container>
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
            rowCount={studentList.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
          />
          <TableBody>
            {studentList
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row: IReceipt, index) => (
                <StudentTableRow key={row.id} row={row} index={index} />
              ))}

            <TableEmptyRows
              height={denseHeight}
              emptyRows={emptyRows(table.page, table.rowsPerPage, studentList.length)}
            />

            <TableNoData notFound={studentList?.length === 0} />
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
};

//---------------------------------------------------------------------

function StudentTableRow({ row, index }: { row: IReceipt; index: number }) {
  const { first_name, last_name, email } = row.student;
  const { end_date, start_date, amount_received, total_sessions } = row;
  const quickEdit = useBoolean();
  const userReceipt: IStudentWithReceipt = {
    ...row.student,
    receipt: [
      {
        ...row,
        start_date: dayjs(end_date).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss'),
      },
    ],
  };

  const sendMail = () => {
    const dataRequest = {
      start_date: dayjs(start_date).format('DD-MM-YYYY'),
      end_date: dayjs(end_date).format('DD-MM-YYYY'),
      user_name: `${first_name} ${last_name}`,
      to_mail: email,
    };

    sendMailReceipt(dataRequest);
    enqueueSnackbar('Gửi email thành công', { variant: 'success' });
  };

  return (
    <>
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
            {dayjs(start_date).format('DD-MM-YYYY')}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(end_date && 'warning') || 'default'}
            sx={{ fontSize: 14, fontWWight: 'medium' }}
          >
            {dayjs(end_date).format('DD-MM-YYYY')}
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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Button
            variant="outlined"
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              sendMail();
            }}
          >
            {' '}
            Gửi email{' '}
          </Button>
        </TableCell>
      </TableRow>

      <ReceiptCreateCardView
        currentUser={userReceipt}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        id={row.student.id}
        idReceipt={row.id}
      />
    </>
  );
}
