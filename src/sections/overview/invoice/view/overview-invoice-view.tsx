'use client';

import useSWR from 'swr';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import InvoiceDateView from '../invoice-date-view';
import InvoiceNewDateView from '../invoice-new-date-view';

// ----------------------------------------------------------------------

export default function OverviewInVoiceView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const filter = {
    _and: [
      { end_date: { _lte: '$NOW' } },
      { end_date: { _gte: '$NOW(-3 day)' } },
      { status: { _eq: 'published' } },
      { student: { _eq: user?.id } },
    ],
  };

  const { data, error, isLoading } = useSWR(
    `/items/receipt?fields=*,student.*&filter=${JSON.stringify(filter)}`
  );

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Hoá đơn"
        links={[{ name: 'Trang chủ', href: paths.dashboard.root }, { name: 'Biên lai' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <InvoiceDateView data={data} />
      <InvoiceNewDateView data={data} />
    </Container>
  );
}
