'use client';

import useSWR from 'swr';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import axiosInstance, { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify/iconify';
import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';
import NoDataAttendanceView from 'src/sections/error/nodata-attendance-view';

import { IClassProps } from 'src/types/class';

import AttendanceMainView from '../list/attendance-main-view';

// ----------------------------------------------------------------------

export default function AttendancePage() {
  const settings = useSettingsContext();

  const [data, setData] = useState<IClassProps[]>([]);

  const [noData, setNoData] = useState(false);

  const {
    data: time_shift,
    error,
    isLoading,
  } = useSWR('/items/class?fields=*,time_shift.*,students.directus_users_id.*', fetcher);

  const currents = dayjs();

  const dayCurrent = currents.day() + 1;

  useEffect(() => {
    if (!time_shift) return;
    const currentTime: any = currents.format('HH:mm:ss').split(':');
    const currentTimeShift = (time_shift || [])?.find((item: any) => {
      const timeStart = item?.time_shift?.start_time.split(':') || [0, 0, 0];
      const timeEnd = item?.time_shift?.end_time.split(':') || [0, 0, 0];
      const start = timeStart[0] * 60 * 60 + timeStart[1] * 60 + timeStart[2] * 1;
      const end = timeEnd[0] * 60 * 60 + timeEnd[1] * 60 + timeEnd[2] * 1;
      const current = currentTime[0] * 60 * 60 + currentTime[1] * 60 + currentTime[2] * 1;
      return current >= start && current <= end + 30 * 60;
    });

    if (!currentTimeShift) {
      setNoData(true);
      return;
    }
    axiosInstance
      .get(
        `/items/class?fields=*,time_shift.*,students.directus_users_id.*,teacher.*&filter[time_shift][_eq]=${currentTimeShift.time_shift.id}`
      )
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((data) => {
        const classActive = (data.data || []).filter((item: any) => {
          const { day } = item;
          return day.includes(`${dayCurrent}`);
        });

        if (classActive.length > 0) {
          setData(classActive);
          setNoData(false);
        } else {
          setNoData(true);
        }
      });
  }, [time_shift, currents, dayCurrent]);

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Điểm danh"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Điểm danh', href: paths.dashboard.general.attendance },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.general.detail}
            variant="outlined"
            color="success"
            startIcon={<Iconify icon="akar-icons:schedule" />}
          >
            Điểm danh
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Box>
        {noData ? (
          <Box>
            <NoDataAttendanceView />
          </Box>
        ) : (
          <AttendanceMainView data={data} />
        )}
      </Box>
    </Container>
  );
}
