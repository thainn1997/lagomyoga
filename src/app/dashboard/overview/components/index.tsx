'use client';

import { useAuthContext } from 'src/auth/hooks';

import StudentOverview from './student';
import OverviewTop from './overview-top';
import BirthdayOverView from './birthday';
import ReceiptFollowMonth from './receipt-follow-month';

export default function OverviewAnalityc() {
  const { user }: any = useAuthContext();
  return (
    <div>
      <OverviewTop />
      <ReceiptFollowMonth />
      {user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && <StudentOverview />}
      <BirthdayOverView />
    </div>
  );
}
