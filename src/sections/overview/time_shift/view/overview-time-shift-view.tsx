'use client';

import useSWR from 'swr';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import TimeShiftListView from '../time-shift-list-view';

// ----------------------------------------------------------------------

export default function TimeShiftOverviewPage() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const { data, error, isLoading } = useSWR('/items/time_shift/', fetcher);
  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Thời gian"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Thời gian', href: paths.dashboard.time.root },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <TimeShiftListView data={data} user={user} />
    </Container>
  );
}
