import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';

import axiosInstance from 'src/utils/axios';

import FormProvider, { RHFSelect } from 'src/components/hook-form';

import { IClassProps } from 'src/types/class';
import { ITimeShift } from 'src/types/time-shift';

import NoDataHistoryClass from './attendance-nodata';
import AttanceListDetailMainView from './attance-list-detail-main-view';

type IProps = {
  time_shift: ITimeShift[];
};

//---------------------------------------------------

export default function AttanceListPickerView({ time_shift }: IProps) {
  const [activeData, setActiveData] = useState<IClassProps[]>();
  const [noData, setNoData] = useState(true);
  const NewUserSchema = Yup.object().shape({
    time_shift: Yup.string().required('Vui lòng chọn thời gian!'),
    dayChange: Yup.mixed<any>().nullable().required('Vui lòng chọn ngày tháng năm!'),
  });

  const defaultValues = useMemo(
    () => ({
      time_shift: '',
      dayChange: dayjs() || null,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    control,
    // setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const date = getValues('dayChange');

  const onSubmit = handleSubmit(async (data) => {
    const currentDate = dayjs(data.dayChange).day() + 1;
    try {
      await axiosInstance
        .get(
          `/items/class?fields=*,time_shift.*,students.directus_users_id.*,teacher.*&filter[time_shift][_eq]=${data.time_shift}`
        )
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .then((data) => {
          const classActive = (data.data || []).filter((item: any) => {
            const { day } = item;
            return day.includes(`${currentDate}`);
          });
          if (classActive.length > 0) {
            setActiveData(classActive);
            setNoData(false);
          } else {
            setNoData(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack sx={{ p: 3, bgcolor: 'background.neutral' }}>
          <Stack spacing={2} mt={2} direction={{ xs: 'column', sm: 'row' }}>
            <Controller
              name="dayChange"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="DD/MM/YYYY"
                  value={field.value}
                  maxDate={dayjs()}
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

            <RHFSelect name="time_shift" label="Thời gian">
              {time_shift
                ?.sort((a: any, b: any) => a.id - b.id)
                .map((time: ITimeShift) => (
                  <MenuItem key={time.id} value={time.id}>
                    {`${time?.start_time.slice(0, 5)} - ${time?.end_time.slice(0, 5)}`}
                  </MenuItem>
                ))}
            </RHFSelect>
          </Stack>
          <Box sx={{ textAlign: 'right', pt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Tìm
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
      {noData ? (
        <Box p={3}>
          <NoDataHistoryClass title="Trống" />
        </Box>
      ) : (
        <Box pt={3} px={3}>
          {(activeData || []).map((item) => (
            <AttanceListDetailMainView key={item.id} historyClass={item} date={date} />
          ))}
        </Box>
      )}
    </>
  );
}
