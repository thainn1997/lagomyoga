import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { renderImageById } from 'src/utils/helper';

import Image from 'src/components/image';

import { IPostProps } from 'src/types/post';

// ----------------------------------------------------------------------

type IProps = {
  blog: IPostProps;
};

export default function BlogDetailView({ blog }: IProps) {
  const { title, thumbnail, content } = blog;

  const renderGallery = (
    <Box
      sx={{
        mb: { xs: 3, md: 5 },
      }}
      textAlign="center"
    >
      <Image
        alt={title}
        src={renderImageById(thumbnail.id, '')}
        sx={{
          borderRadius: 2,
          width: '30%',
          height: '20%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );

  return (
    <>
      {renderGallery}
      <Stack sx={{ mx: 'auto' }}>
        <Stack direction="row" sx={{ mb: 3 }}>
          <Stack>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <Divider />
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          fontSize={16}
          component="div"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />
      </Stack>
    </>
  );
}
