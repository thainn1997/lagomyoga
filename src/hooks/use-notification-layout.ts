import useSWR from 'swr';
import dayjs from 'dayjs';

import { fetcher } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { IStudentUser } from 'src/types/student';

//---------------------------------------------

export function useReceipt(options?: any) {
  const filter = {
    _and: [
      { end_date: { _lte: '$NOW' } },
      { end_date: { _gte: '$NOW(-3 day)' } },
      { status: { _eq: 'published' } },
    ],
  };

  const { data: receipt } = useSWR(
    `/items/receipt?fields=*,student.*&filter=${JSON.stringify(filter)}`,
    fetcher
  );

  return { receipt };
}

//---------------------------------------------

export function useBirthday(options?: any) {
  const today = dayjs().format('MM-DD');
  const { data: birthday } = useSWR<IStudentUser[]>(
    '/users?filter[role][_eq]=b49dda8a-60a9-44b5-9d88-9b0db3480741',
    fetcher
  );
  const currentBirthday = (birthday || []).filter(
    (item) => dayjs(item.birthday).format('MM-DD') === today
  );
  return { currentBirthday };
}

//---------------------------------------------

export function useInvoice(options?: any) {
  const { user } = useAuthContext();

  const filter = {
    _and: [
      { end_date: { _lte: '$NOW' } },
      { end_date: { _gte: '$NOW(-3 day)' } },
      { status: { _eq: 'published' } },
      { student: { _eq: user?.id } },
    ],
  };

  const { data: invoice } = useSWR(
    `/items/receipt?fields=*,student.*&filter=${JSON.stringify(filter)}`
  );

  return { invoice };
}
