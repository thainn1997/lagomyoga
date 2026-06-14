'use client';

import useSWR from 'swr';
import { useEffect } from 'react';

import { fetcher } from 'src/utils/axios';

import { SplashScreen } from 'src/components/loading-screen';

import { NotFoundView } from 'src/sections/error';
import ClassOverviewDetailsView from 'src/sections/overview/class/view/overview-class-detail-view';

// ----------------------------------------------------------------------

export default function ClassDetailPage({ params }: { params: { id: any } }) {
  const { id } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `/items/class/${id}?fields=*,time_shift.*,students.id,students.day_studies,students.directus_users_id.*,teacher.*`,
    fetcher
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return <ClassOverviewDetailsView data={data} />;
}
