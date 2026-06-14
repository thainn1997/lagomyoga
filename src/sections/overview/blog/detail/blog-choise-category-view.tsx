'use client';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Label from 'src/components/label';

import { IPostProps } from 'src/types/post';
import { ICategory } from 'src/types/category';
import { IPostFilters, IPostFilterValue } from 'src/types/blog';

//-----------------------------------------------------

const defaultFilters: IPostFilters = {
  publish: 'all',
};

type IProps = {
  categories: ICategory[];
  posts: IPostProps[];
};

//-----------------------------------------------------

export default function BlogChoiseCategoryView({ categories, posts }: IProps) {
  const [filters, setFilters] = useState(defaultFilters);

  const handleFilters = useCallback((name: string, value: IPostFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterPublish = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );

  return (
    <Tabs
      value={filters.publish}
      onChange={handleFilterPublish}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {categories.map((tab) => (
        <Tab
          key={tab.id}
          iconPosition="end"
          value={tab.id}
          label={tab.title}
          icon={
            <Label
            //   variant={((tab === 'all' || tab === filters.publish) && 'filled') || 'soft'}
            //   color={(tab === 'published' && 'info') || 'default'}
            >
              {/* {tab === 'all' && posts.length} */}

              {tab.title === tab?.title &&
                posts.filter((post) => post.category?.title === tab?.title).length}

              {/* {tab === 'draft' && posts.filter((post) => post.publish === 'draft').length} */}
            </Label>
          }
          sx={{ textTransform: 'capitalize' }}
        />
      ))}
    </Tabs>
  );
}
