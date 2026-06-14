'use client';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IPostProps } from 'src/types/post';
import { ICategory } from 'src/types/category';

import BlogEditView from '../detail/blog-edit-view';

type IProps = {
  data: IPostProps[];
  mutateBlogDetails: any;
  categories: ICategory[];
};

// ----------------------------------------------------------------------

export default function OverviewBlogEditView({ data, mutateBlogDetails, categories }: IProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Chỉnh sửa"
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
            name: 'Chỉnh sửa',
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
      {data?.map((blog) => (
        <BlogEditView
          key={blog.id}
          currentBlog={blog}
          categories={categories}
          mutateBlogDetails={mutateBlogDetails}
        />
      ))}
    </Container>
  );
}
