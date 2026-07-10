/* eslint-disable global-require */
import useSWR from 'swr';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { fetcher } from 'src/utils/axios';

import { USER_STATUS_OPTION } from 'src/_mock/_class';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IStudentUser } from 'src/types/student';

// ----------------------------------------------------------------------

type IProps = {
  open: boolean;
  onClose: VoidFunction;
  currentUser: IStudentUser;
};

export default function StudentUpdateForm({ currentUser, open, onClose }: IProps) {
  const { id } = currentUser;

  const password = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('Vui lòng nhập họ!'),
    last_name: Yup.string().required('Vui lòng nhập tên!'),
    email: Yup.string()
      .nullable()
      .notRequired()
      .transform((value) => (value === '' ? null : value))
      .email('Vui lòng kiểm tra lại email!'),
    password: Yup.string()
      .nullable()
      .notRequired()
      .transform((value) => (value === '' ? null : value)),
    location: Yup.string(),
    status: Yup.string().required('Vui lòng chọn trạng thái!'),
    description: Yup.string(),
    birthday: Yup.mixed<any>().nullable().notRequired(),
    phone: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      last_name: currentUser?.last_name || '',
      first_name: currentUser?.first_name || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '',
      location: currentUser?.location || '',
      status: currentUser?.status || '',
      description: currentUser?.description || '',
      birthday: currentUser?.birthday,
      phone: currentUser?.phone || '',
    }),
    [currentUser]
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

  const { mutate } = useSWR(`/users`, fetcher);

  const onSubmit = handleSubmit(async (data) => {
    const payload: any = { ...data };
    if (!payload.password) {
      delete payload.password;
    }
    try {
      await axiosInstance.patch(`/users/${id}`, {
        ...payload,
      });
      mutate();
      enqueueSnackbar('Chỉnh sửa thành công', { variant: 'success' });
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
      open={open}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Chỉnh sửa</DialogTitle>

        <DialogContent>
          <Box
            mt={3}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            sx={{ mb: 3 }}
          >
            <RHFTextField name="first_name" label="Họ" />

            <RHFTextField name="last_name" label="Tên" />

            <RHFTextField name="email" label="Email" />

            <RHFTextField
              name="password"
              label="Mật khẩu"
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField name="phone" label="Số điện thoại" />

            <RHFSelect name="status" label="Trạng thái">
              {USER_STATUS_OPTION.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField name="location" label="Địa chỉ" />

            <Box>
              <Controller
                name="birthday"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={dayjs(field.value)}
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
          </Box>
          <RHFTextField name="description" multiline rows={3} label="Mô tả" />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Huỷ bỏ
          </Button>

          <LoadingButton type="submit" variant="contained" color="success" loading={isSubmitting}>
            Thay đổi
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
