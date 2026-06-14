'use client';

import useSWR from 'swr';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BlogCreateNewFormView from '../create/blog-create-new-form-view';

// ----------------------------------------------------------------------

export default function OverviewBlogCreateNewView() {
  const settings = useSettingsContext();

  const { data: categories } = useSWR('/items/category');

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Tạo blog"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.blog.root,
          },
          {
            name: 'Tạo',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.blog.root}
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

      <BlogCreateNewFormView categories={categories} />
    </Container>
  );
}
