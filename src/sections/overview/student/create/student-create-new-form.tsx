import useSWR from 'swr';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';
import axiosInstance, { fetcher } from 'src/utils/axios';

import { USER_STATUS_OPTION } from 'src/_mock/_class';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { IFiles } from 'src/types/files';

// ----------------------------------------------------------------------

export default function StudentCreateNewForm() {
  const [errorMsg, setErrorMsg] = useState('');

  const [fileImg, setFileImg] = useState<IFiles>();

  const { mutate } = useSWR('/users', fetcher);

  const router = useRouter();

  const password = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('Vui lòng nhập họ!'),
    last_name: Yup.string().required('Vui lòng nhập tên!'),
    email: Yup.string().required('Vui lòng nhập email!').email('Vui lòng kiểm tra lại email!'),
    password: Yup.string().required('Vui lòng nhập mật khẩu!'),
    location: Yup.string(),
    status: Yup.string().required('Vui lòng chọn trạng thái!'),
    description: Yup.string(),
    birthday: Yup.mixed<any>().nullable().required('Vui lòng chọn ngày tháng năm sinh'),
    phone: Yup.string(),
    avatar: Yup.mixed<any>().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      last_name: '',
      first_name: '',
      email: '',
      password: '',
      location: '',
      status: '',
      description: '',
      birthday: null,
      phone: '',
      avatar: null,
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const current = dayjs(data.birthday).toISOString()
    try {
      await axiosInstance.post('/users', {
        location: data.location,
        description: data.description,
        birthday: current,
        phone: data.phone,
        last_name: data.last_name,
        first_name: data.first_name,
        email: data.email,
        password: data.password,
        status: data.status,
        role: 'b49dda8a-60a9-44b5-9d88-9b0db3480741',
        provider: 'default',
        avatar: fileImg?.id,
      });
      mutate();
      reset();
      enqueueSnackbar('Tạo thành công', { variant: 'success' });
      router.push(paths.dashboard.class.root);
    } catch (error) {
      reset();
      setErrorMsg('Email đã tồn tại!');
      console.log(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatar', newFile, { shouldValidate: true });
      }

      const formData = new FormData();
      formData.append('files', newFile);
      axiosInstance
        .post('/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => setFileImg(res.data))
        .catch((err) => console.log(err));
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                sx={{ objectFit: 'contain' }}
                name="avatar"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box py={3}>
              {!!errorMsg && (
                <Alert variant="outlined" severity="error">
                  {errorMsg}
                </Alert>
              )}
            </Box>

            <Box
              mb={3}
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

              <RHFTextField name="email" label="Email" />

              <RHFTextField
                name="password"
                label="Mật khẩu"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
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
                      label="Ngày sinh"
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
            </Box>
            <RHFTextField name="description" multiline rows={3} label="Mô tả" />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                color="success"
                variant="contained"
                loading={isSubmitting}
              >
                Tạo
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
