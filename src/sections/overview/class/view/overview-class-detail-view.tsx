'use client';

import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IClassProps } from 'src/types/class';

import ClassDetailListView from '../details/class-detail-list-view';

type IProps = {
  data: IClassProps;
};
// ----------------------------------------------------------------------

export default function ClassOverviewDetailsView({ data }: IProps) {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading={data.title}
        links={[
          {
            name: 'Trang chủ',
            href: paths.dashboard.root,
          },
          {
            name: 'Lớp học',
            href: paths.dashboard.class.root,
          },
          { name: 'Xem chi tiết' },
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
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <ClassDetailListView dataTable={data} user={user} />
      </Card>
    </Container>
  );
}
