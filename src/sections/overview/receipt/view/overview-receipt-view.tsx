'use client';

import useSWR from 'swr';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import RouterLink from 'src/routes/components/router-link';

import { fetcher } from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SplashScreen from 'src/components/loading-screen/splash-screen';

import NotFoundView from 'src/sections/error/not-found-view';

import ReceiptListView from '../list/receipt-list-view';

// ----------------------------------------------------------------------

export default function OverviewReceiptView() {
  const settings = useSettingsContext();

  const {
    data: receipt,
    error,
    isLoading,
  } = useSWR(
    '/items/receipt?fields=*,student.*&sort=-date_created&filter[status][_eq]=published',
    fetcher
  );

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;
  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Biên lai"
        links={[{ name: 'Trang chủ', href: paths.dashboard.root }, { name: 'Biên lai' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.receipt.create}
            variant="contained"
            color="error"
          >
            Đóng học phí
          </Button>
        }
      />

      <ReceiptListView receipt={receipt} />
    </Container>
  );
}
