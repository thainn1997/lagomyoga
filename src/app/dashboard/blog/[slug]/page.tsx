'use client';

import useSWR from 'swr';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Box, Tooltip, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import RouterLink from 'src/routes/components/router-link';

import { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify/iconify';
import { SplashScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';

import { NotFoundView } from 'src/sections/error';
import BlogDetailView from 'src/sections/overview/blog/detail/blog-detail-view';

import { IPostProps } from 'src/types/post';

// ----------------------------------------------------------------------

export default function BlogDetailPage({ params }: { params: { slug: any } }) {
  const settings = useSettingsContext();
  const { slug } = params;

  const { data, error, isLoading } = useSWR<IPostProps[]>(
    `/items/post?fields=*.,thumbnail.*&filter[slug][_eq]=${slug}`,
    fetcher
  );

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;
  if (data?.length === 0) return <NotFoundView />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          sx={{ mb: 2 }}
          component={RouterLink}
          href={paths.dashboard.blog.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Quay lại
        </Button>
        <Box>
          <Tooltip title="Chỉnh sửa">
            <IconButton component={RouterLink} href={paths.dashboard.blog.edit(slug)}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {(data || []).map((blog) => (
        <BlogDetailView blog={blog} key={blog.id} />
      ))}
    </Container>
  );
}
