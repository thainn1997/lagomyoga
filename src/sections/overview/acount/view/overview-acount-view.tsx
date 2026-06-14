'use client';

import useSWR from 'swr';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SplashScreen from 'src/components/loading-screen/splash-screen';

import NotFoundView from 'src/sections/error/not-found-view';

import AccountEditFormView from '../account-edit-form-view';

// ----------------------------------------------------------------------

export default function AccountOverviewPage() {
  const settings = useSettingsContext();

  const { data, error, isLoading, mutate } = useSWR('/users/me', fetcher);

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Thông tin tài khoản"
        links={[
          {
            name: 'Trang chủ',
            href: paths.dashboard.root,
          },
          {
            name: 'Tài khoản',
            href: paths.dashboard.account.root,
          },
          { name: `${data?.first_name} ${data?.last_name}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <AccountEditFormView currentUser={data} mutate={mutate} />
    </Container>
  );
}
