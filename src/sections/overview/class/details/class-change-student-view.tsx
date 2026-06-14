import useSWR from 'swr';
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
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import { Grow, Stack, MenuItem } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import axiosInstance, { fetcher } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect } from 'src/components/hook-form';

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

export default function ClassChangeStudentView({
  dataTable,
  currentClass,
  open,
  onClose,
  idParams,
  mutate,
}: Props) {
  const { data } = useSWR(
    '/items/class?fields=*,time_shift.*,students.directus_users_id.*',
    fetcher
  );
  const { directus_users_id, id } = currentClass;
  const { enqueueSnackbar } = useSnackbar();
  const NewUserSchema = Yup.object().shape({
    class_id: Yup.string().required('Vui lòng chọn lớp!'),
  });

  const defaultValues = useMemo(
    () => ({
      class_id: '',
    }),
    []
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

  const updateScheduleReceipt = async (classDirectus: any, old_id_class: any) => {
    const filter = {
      _and: [
        {
          student: { _eq: directus_users_id.id },
          status: { _eq: 'published' },
        },
      ],
    };
    const result = await axiosInstance.get(`/items/receipt?filter=${JSON.stringify(filter)}`);
    if (result.data.length > 0) {
      const dataUpdate = result.data[0];
      dataUpdate.schedule.forEach(async (elm: any) => {
        if (elm.classId === old_id_class) {
          const dayResult = renderCalander(
            new Date(new Date()),
            new Date(dataUpdate.end_date),
            classDirectus.data.day
          );

          const dataClone = Object.assign([], elm.data);
          const dataFilter = dataClone.filter((item: any) =>
            dayjs(item.date, 'DD-MM-YYYY').isBefore(dayjs())
          );
          elm.data = [...dataFilter, ...dayResult];
          elm.classId = classDirectus.data.id;
          await axiosInstance.patch(`/items/receipt/${dataUpdate.id}`, {
            schedule: dataUpdate.schedule,
          });
        }
      });
    }
  };

  const onSubmit = handleSubmit(async (dataForm) => {
    const row = data.find((x: any) => x.id === +dataForm.class_id);
    try {
      await axiosInstance.patch(`/items/class/${idParams}`, {
        students: {
          delete: [id],
        },
      });
      const classDirectus = await axiosInstance.patch(`/items/class/${dataForm.class_id}`, {
        students: {
          create: [
            {
              directus_users_id: {
                id: directus_users_id.id,
              },
              day_studies: row?.day || [],
              class_id: dataForm.class_id,
              class_old: dataForm.class_id,
            },
          ],
        },
      });
      mutate();
      onClose();
      enqueueSnackbar('Chỉnh sửa thành công', { variant: 'success' });
      updateScheduleReceipt(classDirectus, dataTable.id);
    } catch (errorForm) {
      if (errorForm) {
        enqueueSnackbar('Chỉnh sửa không thành công', { variant: 'error' });
        console.error(errorForm);
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
        <DialogTitle>Chuyển lớp</DialogTitle>

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
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFSelect name="class_id" label="Lớp học">
                {data
                  ?.filter((x: any) => x.id !== idParams)
                  .map((detail: any) => (
                    <MenuItem key={detail.id} value={detail.id}>
                      {detail.title}
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
