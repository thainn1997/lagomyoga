import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { Tooltip, CardHeader } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { renderImageById } from 'src/utils/helper';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { IFiles } from 'src/types/files';
import { IStudentUser } from 'src/types/student';

type IProps = {
  currentUser: IStudentUser;
  mutate: VoidFunction;
};
// ----------------------------------------------------------------------

export default function AccountEditFormView({ currentUser, mutate }: IProps) {
  const { id } = currentUser;
  const [messError, setMessError] = useState('');
  const [activeUpdateImg, setActiveUpdateImg] = useState(false);
  const [activeUpdateInformation, setActiveUpdateInformation] = useState(false);
  const [activeUpdatePassword, setActiveUpdatePassword] = useState(false);
  const [fileImg, setFileImg] = useState<IFiles>();

  const password = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('Vui lòng nhập họ!'),
    last_name: Yup.string().required('Vui lòng nhập tên!'),
    email: Yup.string().required('Vui lòng nhập email!').email('Vui lòng kiểm tra lại email!'),
    password: Yup.string(),
    location: Yup.string().required('Vui lòng địa chỉ!'),
    status: Yup.string().required('Vui lòng chọn trạng thái!'),
    description: Yup.string(),
    birthday: Yup.mixed<any>().nullable().required('Vui lòng chọn ngày tháng năm sinh!'),
    phone: Yup.string().required('Vui lòng nhập số điện thoại!'),
    avatar: Yup.mixed<any>().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      last_name: currentUser.last_name || '',
      first_name: currentUser.first_name || '',
      email: currentUser.email || '',
      password: '',
      location: currentUser.location || '',
      status: currentUser.status || '',
      description: currentUser.description || '',
      birthday: currentUser.birthday || null,
      phone: currentUser.phone || '',
      avatar: renderImageById(currentUser.avatar, ''),
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
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const current = dayjs(data.birthday).add(1, 'day');

    try {
      await axiosInstance.patch(`/users/${id}`, {
        location: data.location,
        description: data.description,
        birthday: current,
        phone: data.phone,
        last_name: data.last_name,
        first_name: data.first_name,
        email: data.email,
        avatar: fileImg?.id,
      });
      mutate();
      enqueueSnackbar('Chỉnh sửa thành công', { variant: 'success' });
      setActiveUpdateInformation(false);
    } catch (error) {
      reset();
      enqueueSnackbar('Chỉnh sửa không thành công', { variant: 'error' });
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
      setActiveUpdateImg(true);

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

  const handleUpdateImg = async () => {
    try {
      await axiosInstance.patch(`/users/${id}`, {
        avatar: fileImg?.id,
      });
      mutate();
      enqueueSnackbar('Chỉnh sửa thành công', { variant: 'success' });
      setActiveUpdateImg(false);
    } catch (error) {
      reset();
      enqueueSnackbar('Chỉnh sửa không thành công', { variant: 'error' });
      console.log(error);
    }
  };

  const handleRemoveImg = useCallback(async () => {
    if (!fileImg?.id) {
      setActiveUpdateImg(false);
    } else {
      try {
        await axiosInstance.delete(`/files/${fileImg?.id}`);
        setActiveUpdateImg(false);
        reset();
      } catch (error) {
        console.log(error);
        reset();
      }
    }
  }, [fileImg, reset]);

  const hanldeUpdatePassword = async () => {
    const valuePassword = getValues('password');
    if (valuePassword === '') {
      setMessError('Vui lòng nhập mật khẩu!');
      return;
    }
    if (valuePassword !== '') setMessError('');
    try {
      await axiosInstance.patch(`/users/${id}`, {
        password: valuePassword,
      });
      mutate();
      reset();
      enqueueSnackbar('Chỉnh sửa thành công', { variant: 'success' });
      setActiveUpdatePassword(false);
    } catch (error) {
      reset();
      enqueueSnackbar('Chỉnh sửa không thành công', { variant: 'error' });
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 2 }}>
        <Stack spacing={3}>
          <Card sx={{ px: 3, pb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <CardHeader title="Thông tin cơ bản" sx={{ mb: 2 }} />
              <Box>
                <Tooltip title="Thay đổi" placement="top" arrow>
                  <IconButton
                    color={activeUpdateInformation ? 'inherit' : 'default'}
                    onClick={() => {
                      setActiveUpdateInformation(true);
                    }}
                  >
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                </Tooltip>
              </Box>
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
              <RHFTextField name="first_name" label="Họ" disabled={!activeUpdateInformation} />

              <RHFTextField name="last_name" label="Tên" disabled={!activeUpdateInformation} />

              <RHFTextField name="email" label="Email" disabled={!activeUpdateInformation} />

              <RHFTextField
                name="phone"
                label="Số điện thoại"
                disabled={!activeUpdateInformation}
              />

              <RHFTextField name="location" label="Địa chỉ" disabled={!activeUpdateInformation} />

              <Box>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      disabled={!activeUpdateInformation}
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
            <RHFTextField
              name="description"
              multiline
              rows={3}
              label="Mô tả"
              disabled={!activeUpdateInformation}
            />

            {activeUpdateInformation && (
              <Box textAlign="right" mt={2}>
                <LoadingButton
                  variant="outlined"
                  sx={{ mr: 2 }}
                  loading={isSubmitting}
                  onClick={() => {
                    setActiveUpdateInformation(false);
                    reset();
                  }}
                >
                  Huỷ bỏ
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="error"
                  loading={isSubmitting}
                >
                  Xác nhận
                </LoadingButton>
              </Box>
            )}
          </Card>

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
            <Card sx={{ pb: 5, px: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <CardHeader title="Ảnh đại diện" sx={{ mb: 2 }} />
                <Box>
                  <Tooltip title="Thay đổi" placement="top" arrow>
                    <IconButton
                      color={activeUpdateImg ? 'inherit' : 'default'}
                      onClick={() => {
                        setActiveUpdateImg(true);
                      }}
                    >
                      <Iconify icon="solar:pen-bold" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <RHFUploadAvatar
                sx={{ objectFit: 'contain' }}
                disabled={!activeUpdateImg}
                name="avatar"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  activeUpdateImg && (
                    <Typography
                      component="div"
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                        textDecoration: 'underline',
                      }}
                    >
                      Thay đổi ảnh đại điện
                    </Typography>
                  )
                }
              />

              {activeUpdateImg && (
                <Box textAlign="right" mt={2}>
                  <LoadingButton variant="outlined" sx={{ mr: 2 }} onClick={handleRemoveImg}>
                    Huỷ bỏ
                  </LoadingButton>
                  <LoadingButton variant="contained" color="error" onClick={handleUpdateImg}>
                    Xác nhận
                  </LoadingButton>
                </Box>
              )}
            </Card>

            <Card sx={{ px: 3, pb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <CardHeader title="Đổi mật khẩu" sx={{ mb: 2 }} />
                <Box>
                  <Tooltip title="Thay đổi" placement="top" arrow>
                    <IconButton
                      color={activeUpdatePassword ? 'inherit' : 'default'}
                      onClick={() => {
                        setActiveUpdatePassword(true);
                      }}
                    >
                      <Iconify icon="solar:pen-bold" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <RHFTextField
                name="password"
                label="Mật khẩu"
                type={password.value ? 'text' : 'password'}
                disabled={!activeUpdatePassword}
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
                helperText={messError}
                error={!!messError}
              />
              {activeUpdatePassword && (
                <Box textAlign="right" mt={2}>
                  <LoadingButton
                    variant="outlined"
                    sx={{ mr: 2 }}
                    onClick={() => {
                      setActiveUpdatePassword(false);
                      setMessError('');
                      reset();
                    }}
                  >
                    Huỷ bỏ
                  </LoadingButton>
                  <LoadingButton variant="contained" color="error" onClick={hanldeUpdatePassword}>
                    Xác nhận
                  </LoadingButton>
                </Box>
              )}
            </Card>
          </Box>
        </Stack>
      </Card>
    </FormProvider>
  );
}
