import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export const metadata = {
  title: 'Dashboard: Thông tin',
};

export default function Layout({ children }: Props) {
  return <Box>{children}</Box>;
}
