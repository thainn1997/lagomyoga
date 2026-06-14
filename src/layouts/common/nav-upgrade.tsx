import useSWR from 'swr';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Label from 'src/components/label';
import { SplashScreen } from 'src/components/loading-screen';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR(endpoints.auth.me, fetcher);
  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={data?.avatar} alt={data?.first_name} sx={{ width: 48, height: 48 }} />
          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {`${data?.first_name} ${data?.last_name}`}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {data?.email}
          </Typography>
        </Stack>

        <Button variant="contained" href={paths.minimalUI} target="_blank" rel="noopener">
          Upgrade to Pro
        </Button>
      </Stack>
    </Stack>
  );
}
