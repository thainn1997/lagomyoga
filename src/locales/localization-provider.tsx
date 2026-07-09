'use client';

import 'dayjs/locale/vi';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function LocalizationProvider({ children }: Props) {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      {children}
    </MuiLocalizationProvider>
  );
}
