'use client';

import useSWR from 'swr';
import { useEffect } from 'react';

import { useAuthContext } from 'src/auth/hooks';

import SplashScreen from 'src/components/loading-screen/splash-screen';

import { NotFoundView } from 'src/sections/error';
import OverviewProfileViewPage from 'src/sections/overview/profile/view/overview-profile-view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  const { user } = useAuthContext();

  const filter = { student: { _eq: user?.id }, status: { _eq: 'published' } };

  const {
    data: currentReceipt,
    error: errorReceipt,
    isLoading: loadingReceipt,
    mutate,
  } = useSWR(`/items/receipt?fields=*&filter=${JSON.stringify(filter)}`);

  const {
    data: currentClass,
    error: errorClass,
    isLoading: loadingClass,
  } = useSWR(
    `/items/class?fields=*,time_shift.*&filter[students][directus_users_id][_eq]=${user?.id}`
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (errorReceipt || errorClass) return <NotFoundView />;
  if (loadingReceipt || loadingClass) return <SplashScreen />;

  return (
    <OverviewProfileViewPage
      profile={user}
      currentReceipt={currentReceipt}
      currentClass={currentClass}
      loadingReceipt={loadingReceipt}
    />
  );
}
