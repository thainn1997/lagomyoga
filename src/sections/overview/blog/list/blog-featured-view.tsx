import useSWR from 'swr';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { renderImageById } from 'src/utils/helper';
import axiosInstance, { fetcher } from 'src/utils/axios';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varTranHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import TextMaxLine from 'src/components/text-max-line';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IPostProps } from 'src/types/post';

import OverviewBlogQuickEditView from '../view/overview-blog-quick-edit-view';

const ROLE_ADMIN = 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad';

// ----------------------------------------------------------------------

type Props = {
  post: IPostProps;
  user: any;
};

export default function BlogFeaturedView({ post, user }: Props) {
  const popover = usePopover();

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { title, description, thumbnail, slug, date_created, id } = post;

  const { mutate } = useSWR('/items/post?fields=*.,category.*,thumbnail.*&sort=-id', fetcher);

  const { mutate: mutateCategory } = useSWR('/items/category');

  const handleDeletelBlog = async () => {
    try {
      await axiosInstance.delete(`/items/post/${id}`);
      enqueueSnackbar(`Xoá blog ${title} thành công`, { variant: 'success' });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack component={Card} position="relative" pb={4}>
        <m.div
          whileHover="hover"
          variants={{
            hover: { opacity: 1, scale: 1.01 },
          }}
          transition={varTranHover()}
        >
          <Box
            sx={{
              position: 'relative',
              flexShrink: 0,
              p: 1,
            }}
          >
            <Image
              alt={title}
              src={renderImageById(thumbnail?.id, '')}
              sx={{
                height: 440,
                borderRadius: 1.5,
                width: 1,
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          </Box>
        </m.div>
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Box
            component="span"
            sx={{ typography: 'caption', color: 'text.disabled' }}
            textAlign="right"
          >
            {fDate(date_created)}
          </Box>

          <Stack spacing={1} flexGrow={1}>
            <Link color="inherit" component={RouterLink} href={paths.dashboard.blog.details(slug)}>
              <TextMaxLine variant="subtitle2" fontSize={18} line={2}>
                {title}
              </TextMaxLine>
            </Link>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }} line={2}>
              {description}
            </TextMaxLine>
          </Stack>

          {ROLE_ADMIN === user?.role && (
            <Box textAlign="right" pt={1} position="absolute" bottom={5} right={5}>
              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-horizontal-fill" />
              </IconButton>
            </Box>
          )}
        </Stack>
      </Stack>

      <OverviewBlogQuickEditView open={quickEdit.value} onClose={quickEdit.onFalse} post={post} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.blog.details(slug));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          <strong>Xem chi tiết</strong>
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          <strong>Xoá</strong>
        </MenuItem>

        <MenuItem
          onClick={() => {
            mutateCategory();
            popover.onClose();
            quickEdit.onTrue();
          }}
          sx={{ color: 'primary.main' }}
        >
          <Iconify icon="solar:pen-bold" />
          <strong>Chỉnh sửa</strong>
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={() => {
          confirm.onFalse();
          popover.onClose();
        }}
        title="Xoá"
        content={`Bạn chắc chắn muốn xoá blog "${title.toLocaleUpperCase()}" ?`}
        action={
          <Button variant="contained" color="error" onClick={handleDeletelBlog}>
            Xoá
          </Button>
        }
      />
    </>
  );
}
