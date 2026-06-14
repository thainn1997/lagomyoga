import useSWR from 'swr';
import React from 'react';

import Dialog from '@mui/material/Dialog';

import BlogEditView from '../detail/blog-edit-view';

//----------------------------------------------------------------------------------

type IProps = {
  open: boolean;
  onClose: VoidFunction;
  post: any;
};

export default function OverviewBlogQuickEditView({ open, onClose, post }: IProps) {
  const { data: categories } = useSWR('/items/category');

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      PaperProps={{
        sx: { maxWidth: 920, p: 2 },
      }}
    >
      <BlogEditView currentBlog={post} onClose={onClose} categories={categories} />
    </Dialog>
  );
}
