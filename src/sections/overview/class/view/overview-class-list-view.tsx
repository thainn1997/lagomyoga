'use client';

import useSWR from 'swr';

import { Card, Button } from '@mui/material';
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

import { IStudentUser } from 'src/types/student';

import ClassListView from '../list/class-list-view';

// ----------------------------------------------------------------------

export default function ClassOverviewListPage() {
  const settings = useSettingsContext();

  const { data, error, isLoading } = useSWR(
    '/items/class?fields=*,time_shift.*,students.directus_users_id.*,teacher.*',
    fetcher
  );

  console.log(data);

  const filterTeacher = {
    _and: [
      { role: { _eq: 'abd577a9-620f-4b26-8045-1b46485f501f' } },
      { status: { _eq: 'active' } },
    ],
  };

  const { data: teachers } = useSWR<IStudentUser[]>(
    `/users?filter=${JSON.stringify(filterTeacher)}`
  );

  const { user }: any = useAuthContext();

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Danh sách"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Lớp học', href: paths.dashboard.class.root },
          { name: 'Danh sách' },
        ]}
        action={
          user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && (
            <Button
              component={RouterLink}
              href={paths.dashboard.class.create}
              variant="contained"
              color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Tạo mới
            </Button>
          )
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <ClassListView classList={data} user={user} teachers={teachers} />
      </Card>
    </Container>
  );
}
