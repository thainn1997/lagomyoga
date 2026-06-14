'use client';

import useSWR from 'swr';
import { useEffect } from 'react';

import { SplashScreen } from 'src/components/loading-screen';

import NotFoundView from 'src/sections/error/not-found-view';
import OverviewStudentDetailView from 'src/sections/overview/student/view/overview-student-detail-view';

// ----------------------------------------------------------------------

export default function StudentDetailPage({ params }: { params: { id: any } }) {
  const { id } = params;

  const { data, error, isLoading } = useSWR(`/users/${id}`);

  const filter = { student: { _eq: id }, status: { _eq: 'published' } };

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
  } = useSWR(`/items/class?fields=*,time_shift.*&filter[students][directus_users_id][_eq]=${id}`);

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (error || errorReceipt || errorClass) return <NotFoundView />;
  if (isLoading || loadingReceipt || loadingClass) return <SplashScreen />;

  return (
    <OverviewStudentDetailView
      profile={data}
      currentReceipt={currentReceipt}
      currentClass={currentClass}
      loadingReceipt={loadingReceipt}
    />
  );
}
