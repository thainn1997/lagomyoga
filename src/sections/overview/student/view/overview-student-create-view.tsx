'use client';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import StudentCreateNewForm from '../create/student-create-new-form';

// ----------------------------------------------------------------------

export default function StudentOverviewCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Tạo mới"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Học viên', href: paths.dashboard.class.root },
          { name: 'Tạo mới' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.student.root}
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
      <StudentCreateNewForm />
    </Container>
  );
}
