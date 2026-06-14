import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: 'Dashboard: Xem chi tiết',
};

export default function Layout({ children }: Props) {
  return <Box>{children}</Box>;
}
