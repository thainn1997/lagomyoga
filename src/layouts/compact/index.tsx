import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function CompactLayout({ children }: Props) {
  return (
    <Container component="main">
      <Stack
        sx={{
          py: 12,
          m: 'auto',
          maxWidth: 400,
          minHeight: 'auto',
          textAlign: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Stack>
    </Container>
  );
}
