'use client';

import useSWR from 'swr';
import dayjs from 'dayjs';
import { useState } from 'react';

import Container from '@mui/material/Container';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Card, Grid, Typography } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { useSettingsContext } from 'src/components/settings';

//-------------------------------------------------------------------------------

export default function ReceiptFollowMonth() {
  const settings = useSettingsContext();

  const [month, setMonth] = useState<dayjs.Dayjs | null>(dayjs());

  const [value, setValue] = useState<dayjs.Dayjs | null>(dayjs());

  const filter = {
    _and: [
      { 'month(start_date)': { _eq: `${dayjs(month).month() + 1}` } },
      { 'year(start_date)': { _eq: dayjs(value).year() } },
    ],
  };

  const { data: recipet } = useSWR(
    `/items/receipt?aggregate[sum]=amount_received&filter=${JSON.stringify(filter)}`
  );

  const { sum: total } = (recipet?.[0] as any) || {};

  return (
    <>
      {total && (
        <Container maxWidth={settings.themeStretch ? false : '2xl'}>
          <Grid container spacing={2} sx={{ mt: 6 }}>
            <Grid item xs={12} md={12}>
              <Card sx={{ shadow: 'none' }}>
                <Typography sx={{ my: 2, mx: 2 }} variant="h6">
                  Doanh thu theo tháng
                </Typography>
                <Box display="flex" gap={3} mb={3} mx={2}>
                  <DatePicker
                    views={['month']}
                    label="Tháng"
                    value={dayjs(month)}
                    onChange={(newValue) => {
                      setMonth(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                      },
                    }}
                  />

                  <DatePicker
                    views={['year']}
                    label="Năm"
                    value={dayjs(value)}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                      },
                    }}
                  />
                </Box>
                <Box m={2} sx={{ display: 'flex', alignItems: 'center', fontWeight: '700' }}>
                  TỔNG :
                  <Typography mx={2} variant="subtitle2">
                    {fCurrency(total ? total?.amount_received : 0)} VNĐ
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}
