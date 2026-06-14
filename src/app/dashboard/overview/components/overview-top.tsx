'use client';

import useSWR from 'swr';

import { Card, Stack, Divider, useTheme, Container } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';

import CardAnalytic from './analytic';

const OverviewTop = () => {
  const theme = useTheme();
  const settings = useSettingsContext();
  const { data: recipet } = useSWR(
    '/items/receipt?aggregate[sum]=amount_received,duration&aggregate[count]=student,id'
  );

  const { data: classes } = useSWR('/items/class?aggregate[count]=id,time_shift');

  const { data: student } = useSWR('/users?filter[role][_eq]=b49dda8a-60a9-44b5-9d88-9b0db3480741');

  const { sum: total, count: transaction } = (recipet?.[0] as any) || {};
  const { count: classCount } = (classes?.[0] as any) || {};
  // if (isLoading || isLoadingClass || isLoadingStudent) return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <Card>
        <Scrollbar>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            {transaction && (
              <CardAnalytic
                title="Tổng doanh thu"
                total={`${transaction?.id} giao dịch`}
                percent={100}
                price={total?.amount_received}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />
            )}

            <CardAnalytic
              title="Học sinh"
              total={`${student?.length} học sinh`}
              percent={100}
              icon="solar:accessibility-bold-duotone"
              color={theme.palette.success.main}
            />

            <CardAnalytic
              title="Lớp học"
              total={`${classCount?.id} lớp`}
              percent={100}
              description={`${classCount?.time_shift} ca học`}
              icon="solar:iphone-bold"
              color={theme.palette.warning.main}
            />

            {/* <CardAnalytic
              title="Draft"
              total="0"
              percent={100}
              price={0}
              icon="solar:file-corrupted-bold-duotone"
              color={theme.palette.text.secondary}
            />

            <CardAnalytic
              title="Draft"
              total="0"
              percent={100}
              price={0}
              icon="solar:file-corrupted-bold-duotone"
              color={theme.palette.text.secondary}
            /> */}
          </Stack>
        </Scrollbar>
      </Card>
    </Container>
  );
};

export default OverviewTop;
