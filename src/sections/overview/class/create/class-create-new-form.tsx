import useSWR from 'swr';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Alert, MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { fetcher } from 'src/utils/axios';

import { CLASS_DAY_OPTION } from 'src/_mock/_class';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';

import { ITimeShift } from 'src/types/time-shift';

type IProps = {
  timeShift: ITimeShift[];
  teachers: any;
};

// ----------------------------------------------------------------------

export default function ClassCreateNewForm({ timeShift, teachers }: IProps) {
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required('Vui lòng nhập tên lớp học!'),
    teacher: Yup.string().required('Vui lòng chọn giáo viên'),
    day: Yup.array().nullable().required('Vui lòng chọn ngày học'),
    time_shift: Yup.string().required('Vui lòng chọn thời gian học!'),
  });

  const defaultValues = useMemo(
    () => ({
      title: '',
      time_shift: '',
      teacher: '',
      day: [],
    }),
    []
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

  const { mutate } = useSWR(
    '/items/class?fields=*,time_shift.*,students.directus_users_id.*,teacher.*',
    fetcher
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data };
      await axiosInstance.post('/items/class/', payload);
      mutate();
      reset();
      enqueueSnackbar('Tạo thành công', { variant: 'success' });
      router.push(paths.dashboard.class.root);
    } catch (error) {
      reset();
      enqueueSnackbar('Tạo không thành công', { variant: 'error' });
      setErrorMsg('Vui lòng kiểm tra và điền chính xác thông tin!');
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box p={2}>{!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}</Box>
          <Box
            rowGap={3}
            columnGap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="title" label="Tên lớp học" />

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
              {timeShift
                .sort((a: any, b: any) => a.id - b.id)
                .map((time: ITimeShift) => (
                  <MenuItem key={time.id} value={time.id}>
                    {`${time?.start_time.slice(0, 5)} - ${time?.end_time.slice(0, 5)}`}
                  </MenuItem>
                ))}
            </RHFSelect>
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" color="success" loading={isSubmitting}>
              Tạo
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}
