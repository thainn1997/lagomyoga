'use client';

import useSWR from 'swr';

import { Card, Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SplashScreen from 'src/components/loading-screen/splash-screen';

import NotFoundView from 'src/sections/error/not-found-view';

import AttanceListPickerView from '../detail/attance-list-picker-view';

//-------------------------------------------------------------

export default function OverviewAttendanceDetailPage() {
  const settings = useSettingsContext();

  const { data: time_shift, error, isLoading } = useSWR('/items/time_shift', fetcher);

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Lịch sử"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Điểm danh', href: paths.dashboard.root },
          { name: 'Lịch sử' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.root}
            variant="outlined"
            color="error"
            startIcon={<Iconify icon="lets-icons:back" />}
          >
            Quay lại
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <AttanceListPickerView time_shift={time_shift} />
      </Card>
    </Container>
  );
}
