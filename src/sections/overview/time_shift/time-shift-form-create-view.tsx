import useSWR from 'swr';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { TransitionProps } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ref, useMemo, forwardRef, ReactElement } from 'react';

import Box from '@mui/material/Box';
import { Grow } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { TimePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import axiosInstance, { fetcher } from 'src/utils/axios';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any>;
    },
    ref: Ref<unknown>
  ) => <Grow direction="up" ref={ref} {...props} />
);

type IProps = {
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export default function TimeShiftFormCreateView({ open, onClose }: IProps) {
  const { mutate } = useSWR('/items/time_shift/', fetcher);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    start_time: Yup.string().required('Vui lòng chọn thời gian bắt đầu!'),
    end_time: Yup.string().required('Vui lòng chọn thời gian kết thúc!'),
  });

  const defaultValues = useMemo(
    () => ({
      start_time: '',
      end_time: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.post('/items/time_shift/', {
        start_time: dayjs(data.start_time).format('HH:mm:ss'),
        end_time: dayjs(data.end_time).format('HH:mm:ss'),
        status: 'published',
      });
      mutate();
      reset();
      onClose();
      enqueueSnackbar('Tạo thành công', { variant: 'success' });
    } catch (error) {
      reset();
      enqueueSnackbar('Tạo không thành công', { variant: 'error' });
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
        <DialogTitle>Tạo khung giờ</DialogTitle>

        <DialogContent>
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
              {/* <RHFSelect name="start_time" label="Bắt đầu">
                {CLASS_TIMESHIRT_START_OPTION.map((start) => (
                  <MenuItem key={start.value} value={start.value}>
                    {start.label}
                  </MenuItem>
                ))}
              </RHFSelect> */}

              <Box>
                <Controller
                  name="start_time"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TimePicker
                      label="Bắt đầu"
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
                  name="end_time"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TimePicker
                      label="Kết thúc"
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

              {/* <RHFSelect name="end_time" label="Kết thúc">
                {CLASS_TIMESHIRT_END_OPTION.map((end) => (
                  <MenuItem key={end.value} value={end.value}>
                    {end.label}
                  </MenuItem>
                ))}
              </RHFSelect> */}
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
