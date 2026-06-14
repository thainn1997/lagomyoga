'use client';

import useSWR from 'swr';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SplashScreen from 'src/components/loading-screen/splash-screen';

import NotFoundView from 'src/sections/error/not-found-view';

import ReceiptCreateListView from '../create/receipt-create-list-view';

//-----------------------------------------------------------------------

export default function OverviewReceiptStudentListView() {
  const settings = useSettingsContext();

  const { data, error, isLoading } = useSWR('/users', fetcher);

  const {
    data: receipt,
    error: errorReceipt,
    isLoading: isLoadingReceipt,
  } = useSWR('/items/receipt?fildes=*,&filter[status][_eq]=published', fetcher);

  if (error || errorReceipt) return <NotFoundView />;
  if (isLoading || isLoadingReceipt) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Danh sách "
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Hoá đơn', href: paths.dashboard.receipt.root },
          { name: 'Danh sách' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.receipt.root}
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
      <ReceiptCreateListView currentUser={data} receipt={receipt} />
    </Container>
  );
}
