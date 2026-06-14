import useSWR from 'swr';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Stack, MenuItem } from '@mui/material';
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

import { IStudentWithReceipt } from 'src/types/receipt';

type IProps = {
  open: boolean;
  onClose: VoidFunction;
  id: string;
  currentUser: IStudentWithReceipt;
  idReceipt?: string;
};

//-----------------------------------------------------

export default function ReceiptCreateCardView({
  currentUser,
  id,
  open,
  onClose,
  idReceipt,
}: IProps) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('Vui lòng nhập họ!'),
    last_name: Yup.string().required('Vui lòng nhập tên!'),
    email: Yup.string().required('Vui lòng nhập email!'),
    total_sessions: Yup.number().integer().required('Vui lòng nhập số buổi học!'),
    amount_received: Yup.number().integer().required('Vui lòng nhập học phí!'),
    start_date: Yup.mixed<any>().nullable().required('Vui lòng chọn ngày bắt đầu học'),
    duration: Yup.string().required('Vui lòng chọn thời gian học!'),
  });
  const count = currentUser.receipt.length - 1;

  const defaultValues = useMemo(
    () => ({
      first_name: currentUser.first_name || '',
      last_name: currentUser.last_name || '',
      email: currentUser.email || '',
      amount_received: currentUser.receipt[count]?.amount_received || 0,
      start_date: dayjs(currentUser.receipt[count]?.end_date).add(1, 'day') || dayjs(),
      duration: currentUser.receipt[count]?.duration || '',
      total_sessions: currentUser.receipt[count]?.total_sessions || 12,
    }),
    [currentUser, count]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { mutate } = useSWR(
    '/items/receipt?fields=*,student.*&sort=-date_created&filter[status][_eq]=published',
    fetcher
  );

  const filter = {
    _and: [
      { end_date: { _lte: '$NOW' } },
      { end_date: { _gte: '$NOW(-3 day)' } },
      { status: { _eq: 'published' } },
    ],
  };

  const { mutate: mutateRecipt } = useSWR(
    `/items/receipt?fields=*,student.*&filter=${JSON.stringify(filter)}`
  );

  const { mutate: mutateUser } = useSWR('/users', fetcher);

  const { mutate: allReceipt } = useSWR(
    '/items/receipt?fildes=*,&filter[status][_eq]=published',
    fetcher
  );

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch('amount_received');

  // Code tạo list danh sách thông tin lớp học
  const calanderMulUser = async (fromDate: Date, toDate: Date) => {
    const dayResults: any = [];
    try {
      const res = await axiosInstance.get(
        `/items/class_directus_users?filter[directus_users_id][_eq]=${id}&filter[day_studies][_nnull]=${true}&filter[class_id][_nnull]=${true}`
      );
      console.log(res);
      res.data.forEach((classUser: any) => {
        const result: any = {
          userId: id,
          classId: classUser.class_id,
        };
        const results = renderCalander(fromDate, toDate, classUser?.day_studies);
        result.data = results;
        dayResults.push(result);
      });
      return dayResults;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  // Code render thông tin buổi học
  const renderCalander = (fromDate: Date, toDate: Date, listDay: string[]) => {
    console.log(fromDate, toDate, listDay);
    const dayResults = [];
    const start = dayjs(fromDate);
    const end = dayjs(toDate);
    for (let m = dayjs(start); m.isBefore(end.add(1, 'days')); m = m.add(1, 'days')) {
      const day = m.day();
      const dayString = day === 0 ? 'CN' : (day + 1).toString();
      if (listDay.includes(dayString)) {
        dayResults.push({
          date: m.format('DD-MM-YYYY'),
          dayOfWeek: dayString,
        });
      }
    }
    return dayResults;
  };

  const onSubmit = handleSubmit(async (data) => {
    if (idReceipt) {
      try {
        axiosInstance.patch(`/items/receipt/${idReceipt}`, {
          status: 'older',
        });
        mutateRecipt();
        mutate();
      } catch (error) {
        console.log(error);
      }
    }
    const date = data.start_date.toISOString();
    const start = new Date(date);
    const endDate = dayjs(data.start_date)
      .add(Number(data.duration), 'week')
      .subtract(1, 'day')
      .toISOString();
    const end = new Date(endDate);
    const dayResults = await calanderMulUser(start, end);

    try {
      await axiosInstance.post('/items/receipt', {
        amount_received: data.amount_received,
        start_date: dayjs(date).format('YYYY-MM-DDTHH:mm:ss'),
        student: id,
        total_sessions: data.total_sessions,
        status: 'published',
        duration: data.duration,
        end_date: dayjs(data.start_date)
          .add(Number(data.duration), 'week')
          .subtract(1, 'day')
          .format('YYYY-MM-DDTHH:mm:ss'),
        schedule: dayResults,
      });
      mutateUser();
      allReceipt();
      mutate();
      mutateRecipt();
      enqueueSnackbar('Đóng học phí thành công', { variant: 'success' });
      reset();
      onClose();
    } catch (error) {
      enqueueSnackbar('Đóng học phí không thành công', { variant: 'error' });
      reset();
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Đóng học phí</DialogTitle>

        <DialogContent>
          {/* {messError && (
            <Alert variant="outlined" severity="error" sx={{ mb: 3 }}>
              {messError}
            </Alert>
          )} */}

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            sx={{ my: 3 }}
          >
            <RHFTextField type="text" name="first_name" label="Họ" />

            <RHFTextField type="text" name="last_name" label="Tên" />

            <RHFTextField type="text" name="email" label="Email" />

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

            <RHFTextField type="text" name="total_sessions" label="Số buổi học" />

            <RHFSelect name="duration" label="Thời gian">
              {RECEIPT_WEEK_OPTION.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>

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
          <Button variant="outlined" onClick={onClose}>
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
