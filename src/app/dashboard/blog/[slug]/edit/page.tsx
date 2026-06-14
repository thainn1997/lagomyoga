'use client';

import useSWR from 'swr';
import { useEffect } from 'react';

import { fetcher } from 'src/utils/axios';

import SplashScreen from 'src/components/loading-screen/splash-screen';

import NotFoundView from 'src/sections/error/not-found-view';
import OverviewBlogEditView from 'src/sections/overview/blog/view/overview-blog-edit-view';

// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: EditBlog',
// };

export default function BlogEditPage({ params }: { params: { slug: any } }) {
  const { slug } = params;

  const { data, error, isLoading, mutate } = useSWR(
    `/items/post?fields=*.,category.*,thumbnail.*&filter[slug][_eq]=${slug}`,
    fetcher
  );
  const { data: categories, mutate: mutateCategory } = useSWR('/items/category');

  useEffect(() => {
    mutateCategory();
  }, [mutateCategory]);

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;
  if (data?.length === 0) return <NotFoundView />;

  return <OverviewBlogEditView data={data} mutateBlogDetails={mutate} categories={categories} />;
}
