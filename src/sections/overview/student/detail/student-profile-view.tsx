import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IStudentUser } from 'src/types/student';

type IProps = {
  profile: IStudentUser;
};

// ----------------------------------------------------------------------

export default function StudentProfileView({ profile }: IProps) {
  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string(),
    last_name: Yup.string(),
    email: Yup.string(),
    password: Yup.string(),
    location: Yup.string(),
    status: Yup.string(),
    description: Yup.string(),
    birthday: Yup.mixed<any>().nullable(),
    phone: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      email: profile.email || '',
      password: profile.password || '',
      location: profile.location || '',
      status: profile.status || '',
      description: profile.description || '',
      birthday: dayjs(profile.birthday) || '',
      phone: profile.phone || '',
    }),
    [profile]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { control } = methods;

  return (
    <Box p={3}>
      <FormProvider methods={methods}>
        <Box
          rowGap={3}
          columnGap={4}
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
          <RHFTextField name="password" label="Mật khẩu" type="password" />
          <RHFTextField name="phone" label="Số điện thoại" />

          <RHFTextField
            name="status"
            value={
              (profile.status === 'active' && 'Kích hoạt') ||
              (profile.status === 'draft' && 'Thử nghiệm') ||
              (profile.status === 'invited' && 'Được mời') ||
              (profile.status === 'suspended' && 'Cấm') ||
              (profile.status === 'archived' && 'Đã hoàn thành')
            }
            label="Trạng thái"
          />

          <RHFTextField name="location" label="Địa chỉ" />

          <Box>
            <Controller
              name="birthday"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="DD/MM/YYYY"
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

        <RHFTextField name="description" multiline rows={3} label="Mô tả" fullWidth disabled />
      </FormProvider>
    </Box>
  );
}
