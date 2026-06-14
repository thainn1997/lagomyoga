import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { TransitionProps } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ref, useMemo, forwardRef, ReactElement } from 'react';

import Box from '@mui/material/Box';
import { Grow } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import axiosInstance from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

//---------------------------------------------------

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any>;
    },
    ref: Ref<unknown>
  ) => <Grow direction="up" ref={ref} {...props} />
);

type IProps = {
  open: boolean;
  onClose: VoidFunction;
  mutate: VoidFunction;
};

export default function BlogAddCategoryView({ open, onClose, mutate }: IProps) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required('Vui điền thông tin danh mục'),
  });

  const defaultValues = useMemo(
    () => ({
      title: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.post('/items/category/', {
        status: 'published',
        title: data.title,
        slug: data.title.replace(/\s/g, '-').toLowerCase(),
      });
      mutate();
      reset();
      onClose();
      enqueueSnackbar(`Tạo thành công danh mục ${data.title.toUpperCase()}`, {
        variant: 'success',
      });
    } catch (error) {
      reset();
      enqueueSnackbar(`Tạo thành không công danh mục ${data.title.toUpperCase()}`, {
        variant: 'error',
      });
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      TransitionComponent={Transition}
      maxWidth={false}
      open={open}
      PaperProps={{
        sx: { maxWidth: 600, height: 250 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Tạo danh mục</DialogTitle>

        <DialogContent>
          <Stack spacing={3} mt={2}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="title" label="Tên danh mục" />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              reset();
            }}
          >
            Huỷ bỏ
          </Button>

          <LoadingButton type="submit" variant="contained" color="success" loading={isSubmitting}>
            Đồng ý
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
