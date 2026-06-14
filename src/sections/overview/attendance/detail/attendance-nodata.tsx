import { Theme, SxProps } from '@mui/material';

import EmptyContent from 'src/components/empty-content';

//--------------------------------------------------------------------------------------------

export default function NoDataHistoryClass({ title, sx }: { title: string; sx?: SxProps<Theme> }) {
  return (
    <EmptyContent
      filled
      title={title}
      sx={{
        py: 10,
        ...sx,
      }}
    />
  );
}
