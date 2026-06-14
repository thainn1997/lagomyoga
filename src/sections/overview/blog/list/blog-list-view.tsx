import Box from '@mui/material/Box';

import { IPostProps } from 'src/types/post';

import BlogFeaturedView from './blog-featured-view';

//-------------------------------------------------------------
type IProps = {
  posts: IPostProps[];
  user: any;
};

export default function BlogListView({ posts, user }: IProps) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
    >
      {(posts || []).map((post) => (
        <BlogFeaturedView key={post.id} post={post} user={user} />
      ))}
    </Box>
  );
}
