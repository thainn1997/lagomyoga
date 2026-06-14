import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IReceipt } from 'src/types/receipt';

type IProps = {
  allReceipt: IReceipt[];
  title?: string;
};

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'amount_received', label: 'Học phí' },
  { id: 'date_created', label: 'Ngày đóng', width: 180 },
  { id: 'start_date', label: 'Bắt đầu', width: 180 },
  { id: 'end_date', label: 'Kết thúc', width: 180 },
  { id: 'total_sessions', label: 'Số buổi', width: 120 },
  { id: 'duration', label: 'Tuần', width: 120 },
];

//----------------------------------------------------------

export default function StudentProfileReceiptView({ allReceipt, title }: IProps) {
  const table = useTable();

  const denseHeight = table.dense ? 52 : 72;

  const notFound = !allReceipt?.length;

  return (
    <Card sx={{ mt: 3, borderTopLeftRadius: title ? '' : 0, borderTopRightRadius: title ? '' : 0 }}>
      {title && (
        <Typography sx={{ my: 2, mx: 2 }} variant="h6">
          {title}
        </Typography>
      )}
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={allReceipt?.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  allReceipt.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {(allReceipt || [])
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <ReceiptTableRowView key={row.id} row={row} index={index} title={title} />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, allReceipt?.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <TablePaginationCustom
        count={allReceipt?.length}
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

//------------------------------------------------------------------------------
type Props = {
  row: IReceipt;
  index: number;
  title?: string;
};

function ReceiptTableRowView({ row, index, title }: Props) {
  const { amount_received, date_created, start_date, end_date, total_sessions, duration } = row;

  const confirm = useBoolean();

  return (
    <>
      <TableRow hover component="tr" onClick={confirm.onTrue}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={(index + 1 && 'error') || 'default'} sx={{ fontSize: 14 }}>
            {index + 1}
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
          <Label variant="soft" color={(date_created && 'info') || 'default'} sx={{ fontSize: 14 }}>
            {dayjs(date_created).format('DD-MM-YYYY')}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(start_date && 'success') || 'default'}
            sx={{ fontSize: 14 }}
          >
            {dayjs(start_date).format('DD-MM-YYYY')}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(end_date && 'secondary') || 'default'}
            sx={{ fontSize: 14 }}
          >
            {dayjs(end_date).format('DD-MM-YYYY')}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(total_sessions && 'error') || 'default'}
            sx={{ fontSize: 14 }}
          >
            {total_sessions}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={(duration && 'warning') || 'default'} sx={{ fontSize: 14 }}>
            {duration}
          </Label>
        </TableCell>
      </TableRow>

      <StudentProfileReceiptCofirm
        open={confirm.value}
        onClose={confirm.onFalse}
        currentReceipt={row}
        index={index}
      />
    </>
  );
}

//-----------------------------------------------------------------------

type Prop = {
  currentReceipt: IReceipt;
  open: boolean;
  onClose: VoidFunction;
  index: number;
};

function StudentProfileReceiptCofirm({ currentReceipt, open, onClose, index }: Prop) {
  const defaultValues = useMemo(
    () => ({
      amount_received: currentReceipt.amount_received,
      total_sessions: currentReceipt.total_sessions,
      date_created: dayjs(currentReceipt.date_created),
      start_date: dayjs(currentReceipt.start_date),
      end_date: dayjs(currentReceipt.end_date),
      duration: currentReceipt.duration,
    }),
    [currentReceipt]
  );

  const methods = useForm({
    defaultValues,
  });

  const { control } = methods;

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods}>
        <DialogTitle>Chi tiết</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="success" sx={{ mb: 3 }}>
            Học phí : {dayjs(currentReceipt.date_created).format('DD-MM-YYYY')}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            sx={{ mb: 3 }}
          >
            <RHFTextField
              type="number"
              name="amount_received"
              label="Học phí"
              placeholder="0.00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>VNĐ</Box>
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Controller
                name="date_created"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Ngày đóng"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="start_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Ngày bắt đầu học"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="end_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Ngày kết thúc học"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>

            <RHFTextField type="text" name="total_sessions" label="Số buổi học" />

            <RHFTextField type="text" name="duration" label="Tuần học" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
