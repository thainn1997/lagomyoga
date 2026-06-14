'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';

import Container from '@mui/material/Container';
import { Tab, Tabs, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fetcher } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import { IPostProps } from 'src/types/post';
import { IPostFilters, IPostFilterValue } from 'src/types/blog';

import BlogListView from '../list/blog-list-view';
import BlogCategoryView from '../detail/blog-category-view';

//-------------------------------------------------------------
const defaultFilters: IPostFilters = {
  publish: 'tất cả',
};

//-------------------------------------------------------------

export default function OverviewBlogViewPage() {
  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const { user }: any = useAuthContext();

  const action = useBoolean();

  const { role } = user;

  const { data, error, isLoading } = useSWR(
    '/items/post?fields=*.,category.*,thumbnail.*&sort=-id',
    fetcher
  );

  const { data: categories, mutate } = useSWR('items/category');

  const titleCategories = (categories || []).map((i: any) => i.title);

  titleCategories.unshift('tất cả');

  const handleFilters = useCallback((name: string, value: IPostFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterPublish = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('publish', newValue);
    },

    [handleFilters]
  );

  const dataFiltered = applyFilter({
    inputData: data,
    filters,
  });

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Blog"
        links={[
          {
            name: 'Trang chủ',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.blog.root,
          },
          {
            name: 'Danh sách',
          },
        ]}
        action={
          role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && (
            <Button
              component={RouterLink}
              href={paths.dashboard.blog.create}
              variant="contained"
              color="success"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Tạo Blog
            </Button>
          )
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack display="flex" justifyContent="space-between" flexDirection="row">
        <BlogCategoryView
          open={action.value}
          onClose={action.onFalse}
          categories={categories}
          mutate={mutate}
        />

        <Tabs
          value={filters.publish}
          onChange={handleFilterPublish}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {titleCategories.map((tab: any) => (
            <Tab
              key={tab}
              iconPosition="end"
              value={tab}
              label={tab}
              icon={
                <Label
                  variant={((tab === 'tất cả' || tab === filters.publish) && 'filled') || 'soft'}
                  color={(tab !== 'tất cả' && 'info') || 'default'}
                >
                  {(tab === 'tất cả' && data.length) ||
                    (tab !== 'tất cả' &&
                      data.filter((post: any) => post?.category?.title === tab).length)}
                </Label>
              }
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Tabs>

        <Stack sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="error"
            sx={{ width: 'fit-content' }}
            onClick={() => {
              action.onTrue();
              mutate();
            }}
          >
            DANH MỤC
          </Button>
        </Stack>
      </Stack>

      <BlogListView posts={dataFiltered} user={user} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  inputData,
  filters,
}: {
  inputData: IPostProps[];
  filters: IPostFilters;
}) => {
  const { publish } = filters;

  if (publish !== 'tất cả') {
    inputData = inputData?.filter((post: any) => post?.category?.title === publish);
  }

  return inputData;
};
