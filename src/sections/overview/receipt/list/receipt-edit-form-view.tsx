import useSWR from 'swr';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { fCurrency } from 'src/utils/format-number';
import axiosInstance, { fetcher } from 'src/utils/axios';

import { RECEIPT_WEEK_OPTION } from 'src/_mock/_class';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IReceipt } from 'src/types/receipt';
import { IStudentUser } from 'src/types/student';

type IProps = {
  open: boolean;
  onClose: VoidFunction;
  user: IStudentUser;
  dataReceipt: IReceipt;
};

//--------------------------------------------------------------------------

export default function ReceiptEditFormView({ dataReceipt, open, onClose, user }: IProps) {
  const { id } = dataReceipt;

  const { id: idUser } = user;

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('Vui lòng nhập họ!'),
    last_name: Yup.string().required('Vui lòng nhập tên!'),
    email: Yup.string()
      .nullable()
      .notRequired()
      .transform((value) => (value === '' ? null : value))
      .email('Vui lòng kiểm tra lại email!'),
    total_sessions: Yup.number().integer().required('Vui lòng nhập số buổi học!'),
    amount_received: Yup.number().integer().required('Vui lòng nhập học phí!'),
    start_date: Yup.mixed<any>().nullable().required('Vui lòng chọn ngày bắt đầu học'),
    duration: Yup.string().required('Vui lòng chọn thời gian học!'),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      total_sessions: dataReceipt.total_sessions,
      amount_received: dataReceipt.amount_received,
      start_date: dayjs(dataReceipt.start_date),
      duration: dataReceipt?.duration || '',
    }),
    [user, dataReceipt]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate } = useSWR(
    '/items/receipt?fields=*,student.*&sort=-date_created&filter[status][_eq]=published',
    fetcher
  );

  const values = watch('amount_received');

  const onSubmit = handleSubmit(async (data) => {
    const date = dayjs(data.start_date);

    try {
      await axiosInstance.patch(`/items/receipt/${id}`, {
        amount_received: data.amount_received,
        start_date: date.toISOString(),
        student: idUser,
        total_sessions: data.total_sessions,
        status: 'published',
        duration: data.duration,
        end_date: date.add(Number(data.duration), 'week').subtract(1, 'day').toISOString(),
      });
      enqueueSnackbar('Chỉnh sửa thành công', { variant: 'success' });
      mutate();
      onClose();
    } catch (error) {
      enqueueSnackbar('Chỉnh sửa không thành công', { variant: 'error' });
      reset();
      console.error(error);
    }
  });

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
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Chỉnh sửa</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Đang chờ xác nhận!
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
            <RHFTextField type="text" name="first_name" label="Họ" />

            <RHFTextField type="text" name="last_name" label="Tên" />

            <RHFTextField type="text" name="email" label="Email" />

            <RHFTextField type="text" name="total_sessions" label="Số buổi học" />

            <RHFSelect name="duration" label="Thời gian">
              {RECEIPT_WEEK_OPTION.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>

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

            <Stack
              spacing={2}
              alignItems="flex-end"
              sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
            >
              <Stack direction="row" sx={{ typography: 'subtitle1' }}>
                <Box>Tổng</Box>
                <Box sx={{ width: 160 }}>{fCurrency(values) || '-'}</Box>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
            }}
          >
            Huỷ bỏ
          </Button>

          <LoadingButton type="submit" variant="contained" color="success" loading={isSubmitting}>
            Đồng ý
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
