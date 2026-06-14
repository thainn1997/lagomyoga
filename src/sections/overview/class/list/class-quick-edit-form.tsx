import useSWR from 'swr';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { TransitionProps } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ref, useMemo, forwardRef, ReactElement } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Grow, Stack } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import axiosInstance, { fetcher } from 'src/utils/axios';

import { CLASS_DAY_OPTION } from 'src/_mock/_class';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';

import { IClassProps } from 'src/types/class';
import { ITimeShift } from 'src/types/time-shift';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentClass: IClassProps;
  teachers: any;
};

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any>;
    },
    ref: Ref<unknown>
  ) => <Grow direction="up" ref={ref} {...props} />
);

export default function ClassQuickEditForm({ currentClass, open, onClose, teachers }: Props) {
  const { mutate } = useSWR(
    '/items/class?fields=*,time_shift.*,students.directus_users_id.*,teacher.*',
    fetcher
  );
  const { data: time_shift } = useSWR('/items/time_shift', fetcher);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required('Vui lòng nhập tên lớp học!'),
    teacher: Yup.string().required('Vui lòng chọn giáo viên'),
    day: Yup.array().nullable().required('Vui lòng chọn ngày học'),
    time_shift: Yup.string().required('Vui lòng chọn thời gian học!'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentClass?.title || '',
      teacher: currentClass?.teacher?.id || '',
      day: currentClass?.day || [],
      time_shift: currentClass?.time_shift?.id || '',
    }),
    [currentClass]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data };
      await axiosInstance.patch(`/items/class/${currentClass.id}`, payload);
      mutate();
      onClose();
      enqueueSnackbar('Chỉnh sửa thành công', { variant: 'success' });
    } catch (error) {
      if (error) {
        enqueueSnackbar('Chỉnh sửa không thành công', { variant: 'error' });
        console.error(error);
      }
    }
  });

  return (
    <Dialog
      fullWidth
      TransitionComponent={Transition}
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Chỉnh sửa</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Vui lòng xác nhận các thông tin
          </Alert>

          <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="title" label="Lớp học" />

              <RHFSelect name="teacher" label="Giáo viên">
                {teachers?.length === 0 && <MenuItem value="">Trống</MenuItem>}
                {teachers?.map((teacher: any) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher?.first_name} {teacher?.last_name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFMultiSelect checkbox name="day" label="Ngày học" options={CLASS_DAY_OPTION} />

              <RHFSelect name="time_shift" label="Thời gian">
                {time_shift
                  ?.sort((a: any, b: any) => a.id - b.id)
                  .map((time: ITimeShift) => (
                    <MenuItem key={time.id} value={time.id}>
                      {`${time?.start_time.slice(0, 5)} - ${time?.end_time.slice(0, 5)}`}
                    </MenuItem>
                  ))}
              </RHFSelect>
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
