import dayjs from 'dayjs';
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
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import axiosInstance from 'src/utils/axios';

import { CLASS_DAY_OPTION } from 'src/_mock/_class';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFMultiSelect } from 'src/components/hook-form';

import { IClassProps, IDirectusUser } from 'src/types/class';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentClass: IDirectusUser;
  idParams: any;
  mutate: VoidFunction;
  dataTable: IClassProps;
};

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any>;
    },
    ref: Ref<unknown>
  ) => <Grow direction="up" ref={ref} {...props} />
);

export default function ClassEditDayStudyView({
  dataTable,
  currentClass,
  open,
  onClose,
  idParams,
  mutate,
}: Props) {
  const { directus_users_id, id, day_studies } = currentClass;

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('Vui lòng nhập họ!'),
    last_name: Yup.string().required('Vui lòng nhập tên!'),
    email: Yup.string().required('Vui lòng nhập email!'),
    day_studies: Yup.array().nullable().required('Vui lòng chọn ngày học'),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: directus_users_id?.first_name || '',
      last_name: directus_users_id?.last_name || '',
      email: directus_users_id?.email || '',
      day_studies: dataTable.day || day_studies || [],
    }),
    [directus_users_id, dataTable, day_studies]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const renderCalander = (fromDate: Date, toDate: Date, listDay: string[]) => {
    const dayResults = [];
    const start = dayjs(fromDate);
    const end = dayjs(toDate);
    for (let m = dayjs(start); m.isBefore(end.add(1, 'days')); m = m.add(1, 'days')) {
      const d = m.day();
      const dayString = d === 0 ? 'CN' : (d + 1).toString();
      if (listDay.includes(dayString)) {
        dayResults.push({
          date: m.format('DD-MM-YYYY'),
          dayOfWeek: dayString,
        });
      }
    }
    return dayResults;
  };

  const updateScheduleReceipt = async (day: string[]) => {
    const filter = {
      _and: [
        {
          student: {_eq:  directus_users_id.id} ,
          status: { _eq: "published" },
        },
      ],
    };
    const result = await axiosInstance.get(
      `/items/receipt?filter=${JSON.stringify(filter)}`
    );
    if(result.data.length > 0) {
      const dataUpdate = result.data[0];
      const dayResult = renderCalander(new Date(dataUpdate.start_date),new Date(dataUpdate.end_date),day);
      dataUpdate.schedule = dataUpdate.schedule.map((value: any) => {
        if(value.classId === idParams){
          value.data = dayResult;
        }
        return value;
      })
      
      await axiosInstance.patch(`/items/receipt/${dataUpdate.id}`,{
        schedule: dataUpdate.schedule
      })
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.patch(`/items/class/${idParams}`, {
        students: {
          update: [
            {
              id,
              day_studies: data.day_studies,
            },
          ],
        },
      });
      mutate();
      onClose();
      enqueueSnackbar('Chỉnh sửa thành công', { variant: 'success' });
      updateScheduleReceipt(data.day_studies);
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
              <RHFTextField name="first_name" label="Họ" />

              <RHFTextField name="last_name" label="Tên" />

              <RHFTextField name="email" label="email" />

              <RHFMultiSelect
                checkbox
                name="day_studies"
                label="Ngày học"
                options={CLASS_DAY_OPTION}
              />
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
