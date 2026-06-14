'use client';

import useSWR from 'swr';
import { useEffect } from 'react';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SplashScreen from 'src/components/loading-screen/splash-screen';

import NotFoundView from 'src/sections/error/not-found-view';

import { IStudentUser } from 'src/types/student';

import ClassCreateNewForm from '../create/class-create-new-form';

// ----------------------------------------------------------------------

export default function ClassOverviewCreateView() {
  const settings = useSettingsContext();
  const { data, error, isLoading, mutate } = useSWR('/items/time_shift', fetcher);

  const filterTeacher = {
    _and: [
      { role: { _eq: 'abd577a9-620f-4b26-8045-1b46485f501f' } },
      { status: { _eq: 'active' } },
    ],
  };

  const { data: teachers } = useSWR<IStudentUser[]>(
    `/users?filter=${JSON.stringify(filterTeacher)}`
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Tạo mới"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Lớp học', href: paths.dashboard.class.root },
          { name: 'Tạo mới' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.class.root}
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

      <ClassCreateNewForm timeShift={data} teachers={teachers} />
    </Container>
  );
}
