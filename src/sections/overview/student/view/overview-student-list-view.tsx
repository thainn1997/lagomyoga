'use client';

import useSWR from 'swr';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fetcher } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import StudentListView from '../list/student-list-view';

// ----------------------------------------------------------------------

export default function StudentOverviewListPage() {
  const settings = useSettingsContext();
  const { user }: any = useAuthContext();

  const { data, error, isLoading } = useSWR(
    `/users?fields=id,first_name,last_name,email,role.name&filter[role][name][_contains]=Student&limit=-1`,
    fetcher
  );
  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Học viên"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Quản lý học viên', href: paths.dashboard.student.root },
          { name: 'Danh sách' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && (
            <Button
              component={RouterLink}
              href={paths.dashboard.student.create}
              variant="contained"
              color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Tạo Học Viên
            </Button>
          )
        }
      />

      <StudentListView studentList={data} user={user} />
    </Container>
  );
}
