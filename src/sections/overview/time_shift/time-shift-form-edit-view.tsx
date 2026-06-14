import useSWR from 'swr';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { TransitionProps } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ref, useMemo, useState, forwardRef, ReactElement } from 'react';

import Box from '@mui/material/Box';
import { Grow } from '@mui/material';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import axiosInstance, { fetcher } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { ITimeShift } from 'src/types/time-shift';

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any>;
    },
    ref: Ref<unknown>
  ) => <Grow direction="up" ref={ref} {...props} />
);

type IProps = {
  currentTimeShift: ITimeShift;
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export default function TimeShiftFormEditView({ currentTimeShift, open, onClose }: IProps) {
  const { id } = currentTimeShift;

  const [errMess, setErrMess] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useSWR('/items/time_shift/', fetcher);

  const NewUserSchema = Yup.object().shape({
    start_time: Yup.string().required('Vui lòng nhập thời gian bắt đầu!'),
    end_time: Yup.string().required('Vui lòng nhập thời gian kết thúc!'),
  });

  const defaultValues = useMemo(
    () => ({
      start_time: currentTimeShift.start_time?.slice(0, 5) || '',
      end_time: currentTimeShift.end_time?.slice(0, 5) || '',
    }),
    [currentTimeShift]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data };
      await axiosInstance.patch(`/items/time_shift/${id}`, {
        ...payload,
        status: 'published',
      });
      onClose();
      mutate();
      enqueueSnackbar('Thay đổi thành công', { variant: 'success' });
    } catch (error) {
      reset();
      enqueueSnackbar('Thay đổi không thành công', { variant: 'error' });
      setErrMess('Vui lòng nhập đúng theo cú pháp HH:mm');
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      TransitionComponent={Transition}
      maxWidth={false}
      open={open}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Chỉnh sửa khung giờ</DialogTitle>

        <DialogContent>
          {!!errMess && (
            <Alert variant="outlined" severity="error" sx={{ mb: 3 }}>
              {errMess}
            </Alert>
          )}
          <Stack spacing={3} mt={2}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="start_time" label="Bắt đầu" />
              <RHFTextField name="end_time" label="Kết thúc" />
            </Box>
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
