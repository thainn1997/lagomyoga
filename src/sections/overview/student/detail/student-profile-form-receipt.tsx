import useSWR from 'swr';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
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

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

type IProps = {
  open: boolean;
  onClose: VoidFunction;
  id: string;
};

//-----------------------------------------------------

export default function StudentProfileFormReceipt({ id, open, onClose }: IProps) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    amount_received: Yup.number().integer().required('Vui lòng nhập học phí!'),
    start_date: Yup.mixed<any>().nullable().required('Vui lòng chọn ngày bắt đầu học'),
  });

  const defaultValues = useMemo(
    () => ({
      amount_received: 0,
      start_date: null || new Date(),
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { mutate } = useSWR(`/items/receipt?filter[student][_eq]=${id}`, fetcher);

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch('amount_received');

  const onSubmit = handleSubmit(async (data) => {
    const date = data.start_date.toISOString();

    try {
      await axiosInstance.post('/items/receipt', {
        amount_received: data.amount_received,
        start_date: date,
        student: id,
        total_sessions: 12,
        status: 'published',
      });
      mutate();
      enqueueSnackbar('Đóng học phí thành công', { variant: 'success' });

      reset();
      onClose();
    } catch (error) {
      enqueueSnackbar('Không thành công', { variant: 'error' });
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
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
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
