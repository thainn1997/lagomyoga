import React, { Ref, forwardRef, ReactElement } from 'react';

import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Card, Button, Divider, IconButton, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ICategory } from 'src/types/category';

import BlogAddCategoryView from './blog-add-category-view';

//-----------------------------------------------

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any>;
    },
    ref: Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

type IProps = {
  categories: ICategory[];
  open: boolean;
  onClose: VoidFunction;
  mutate: VoidFunction;
};

export default function BlogCategoryView({ open, onClose, categories, mutate }: IProps) {
  const unhideFormAddCategory = useBoolean();

  const handleAddCategory = () => {
    onClose();
    unhideFormAddCategory.onTrue();
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        TransitionComponent={Transition}
        maxWidth={false}
        PaperProps={{
          sx: { maxWidth: 600, height: 300 },
        }}
      >
        <DialogActions sx={{ position: 'relative' }}>
          <IconButton
            title="Đóng"
            onClick={() => {
              onClose();
            }}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            textAlign="center"
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          >
            Danh mục
          </Typography>
        </DialogActions>

        <Divider />

        <Scrollbar>
          <Box
            my={2}
            px={{ xs: 1, sm: 2 }}
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Button
              variant="contained"
              color="error"
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: (t) => t.spacing(2),
              }}
              onClick={handleAddCategory}
            >
              + Thêm
            </Button>
            {(categories || [])
              .sort((a: any, b: any) => a.id - b.id)
              .map((category: any) => (
                <BlogCardCategoryView key={category.id} category={category} mutate={mutate} />
              ))}
          </Box>
        </Scrollbar>
      </Dialog>
      <BlogAddCategoryView
        open={unhideFormAddCategory.value}
        onClose={unhideFormAddCategory.onFalse}
        mutate={mutate}
      />
    </>
  );
}

//--------------------------------------------------

type IBlogCardCategory = {
  category: any;
  mutate: VoidFunction;
};

function BlogCardCategoryView({ category, mutate }: IBlogCardCategory) {
  const unhideRemoveCategory = useBoolean();

  const hanldeRemoveCategory = () => {
    unhideRemoveCategory.onTrue();
  };

  const onDeleteCategory = async (id: any) => {
    try {
      await axiosInstance.delete(`/items/category/${id}`);
      mutate();
      unhideRemoveCategory.onFalse();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: (t) => t.spacing(2),
          cursor: 'pointer',
        }}
      >
        <ListItemText
          primary={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                justifyContent: 'space-between',
              }}
            >
              <Iconify
                icon="carbon:category-new-each"
                width={16}
                sx={{ flexShrink: 0, mr: 5 }}
                style={{ color: '#2137de' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%)',
                  textTransform: 'capitalize',
                }}
              >
                {category?.title}
              </Box>
              <IconButton title="Đóng" onClick={hanldeRemoveCategory} color="error">
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Box>
          }
          primaryTypographyProps={{
            noWrap: true,
            typography: 'subtitle2',
          }}
        />
      </Card>
      <ConfirmDialog
        open={unhideRemoveCategory.value}
        onClose={unhideRemoveCategory.onFalse}
        title="Xoá"
        content={`Bạn chắc chắn muốn xoá lớp "${category?.title.toLocaleUpperCase()}" ?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteCategory(category.id);
            }}
          >
            Xoá
          </Button>
        }
      />
    </>
  );
}
