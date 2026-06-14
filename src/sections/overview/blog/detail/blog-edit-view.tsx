import useSWR from 'swr';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { renderImageById } from 'src/utils/helper';
import axiosInstance, { fetcher } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';

import { IFiles } from 'src/types/files';
import { IPostProps } from 'src/types/post';
import { ICategory } from 'src/types/category';

type IProps = {
  currentBlog?: IPostProps;
  onClose?: VoidFunction;
  categories: ICategory[];
  mutateBlogDetails?: any;
};

// ----------------------------------------------------------------------

export default function BlogEditView({
  currentBlog,
  onClose,
  categories,
  mutateBlogDetails,
}: IProps) {
  const router = useRouter();

  const [fileImg, setFileImg] = useState<IFiles>();

  const preview = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Vui lòng tiêu đề'),
    description: Yup.string().required('Vui lòng nhập mô tả'),
    content: Yup.string().required('Vui lòng nhập nội dung'),
    thumbnail: Yup.mixed<any>().nullable().required('Vui lòng chọn tệp'),
    category: Yup.mixed<any>().required('Vui lòng chọn thể loại'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentBlog?.title || '',
      description: currentBlog?.description || '',
      content: currentBlog?.content || '',
      thumbnail: renderImageById(currentBlog?.thumbnail.id as string, '') || null,
      category: currentBlog?.category?.id || '',
    }),
    [currentBlog]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate } = useSWR('/files', fetcher);
  const { mutate: mutateBlog } = useSWR('/items/post?fields=*.,category.*,thumbnail.*', fetcher);

  useEffect(() => {
    setFileImg(fileImg);
  }, [fileImg]);

  const onSubmit = handleSubmit(async (data) => {
    if (currentBlog) {
      try {
        await axiosInstance.patch(`/items/post/${currentBlog.id}`, {
          status: 'published',
          title: data.title,
          description: data.description,
          content: data.content,
          thumbnail: fileImg?.id,
          slug: data.title.replace(/\s/g, '-').toLowerCase(),
          category: data.category,
        });
        mutateBlog();
        mutate();
        reset();
        mutateBlogDetails();
        enqueueSnackbar(`Chỉnh sửa blog ${data.title} thành công`, {
          variant: 'success',
        });
        preview.onFalse();
        router.push(paths.dashboard.blog.root);
      } catch (error) {
        console.log(error);
      }
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('thumbnail', newFile, { shouldValidate: true });
      }

      const formData = new FormData();
      formData.append('files', newFile);
      axiosInstance
        .post('/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => setFileImg(res.data))
        .catch((err) => console.log(err));
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(async () => {
    setValue('thumbnail', null);
    try {
      await axiosInstance.delete(`/files/${fileImg?.id}`);
    } catch (error) {
      console.log(error);
    }
  }, [setValue, fileImg]);

  const renderDetails = (
    <Grid>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFSelect name="category" label="Danh mục">
            {(categories || []).map((category: ICategory) => (
              <MenuItem key={category.id} value={category.id} sx={{ textTransform: 'capitalize' }}>
                {category.title}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFTextField name="title" label="Tiêu đề" />

          <RHFTextField name="description" label="Mô tả" multiline rows={3} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Nội dung</Typography>
            <RHFEditor simple name="content" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Hình ảnh</Typography>
            <RHFUpload
              name="thumbnail"
              maxSize={3145728}
              onDrop={handleDrop}
              onDelete={handleRemoveFile}
            />
          </Stack>
        </Stack>
        <Grid textAlign="right">
          <LoadingButton
            type="submit"
            variant="contained"
            color="error"
            loading={isSubmitting}
            sx={{ ml: 2, mr: 2 }}
            onClick={onClose}
          >
            Chỉnh sửa
          </LoadingButton>
          {onClose && (
            <Button variant="outlined" onClick={onClose}>
              Huỷ bỏ
            </Button>
          )}
        </Grid>
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} direction="column">
        {renderDetails}
      </Grid>
    </FormProvider>
  );
}
