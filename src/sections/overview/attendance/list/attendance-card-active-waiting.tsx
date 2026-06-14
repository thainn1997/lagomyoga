import useSWR from 'swr';
import React, { useRef } from 'react';

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { Box, Button, ListItemText, CircularProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { renderImageById } from 'src/utils/helper';
import axiosInstance, { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

type IProps = {
  item: any;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  mutateAttendance: VoidFunction;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

//-----------------------------------------------------

export default function AttendanceCardActiveWaiting({
  item,
  setCount,
  mutateAttendance,
  isLoading,
  setIsLoading,
}: IProps) {
  const { directus_users_id, id } = item;

  const prevent = useRef(false);

  const theme = useTheme();

  const confirm = useBoolean();

  const { mutate } = useSWR('/items/student_attendance_log/', fetcher);

  const handleCancel = async () => {
    if (!prevent.current) {
      try {
        setIsLoading(true);
        await axiosInstance.delete(`/items/student_attendance_log/${id}`);
        prevent.current = true;
        mutateAttendance();
        mutate();
        setCount((prev) => prev - 1);
        confirm.onFalse();
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {!isLoading && (
        <Card
          component="div"
          onClick={() => {
            confirm.onTrue();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: (t) => t.spacing(3, 2, 3, 3),
            background: item ? alpha(theme.palette.grey[500], 0.3) : '',
            cursor: 'pointer',
          }}
        >
          <Badge
            overlap="circular"
            color={item ? 'success' : 'error'}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Iconify
                icon={
                  item ? 'eva:diagonal-arrow-right-up-fill' : 'eva:diagonal-arrow-left-down-fill'
                }
                width={16}
              />
            }
            sx={{
              [`& .${badgeClasses.badge}`]: {
                p: 0,
                width: 20,
              },
              mr: 2,
            }}
          >
            <Avatar
              alt={directus_users_id.last_name}
              src={renderImageById(
                directus_users_id.avatar,
                directus_users_id.last_name[0].toLocaleUpperCase()
              )}
              sx={{ width: 48, height: 48 }}
            />
          </Badge>
          <ListItemText
            primary={`${directus_users_id.first_name} ${directus_users_id.last_name}`}
            secondary={
              <>
                <Iconify
                  icon="noto:closed-mailbox-with-raised-flag"
                  width={16}
                  sx={{ flexShrink: 0, mr: 0.5 }}
                />
                {directus_users_id.email}
              </>
            }
            primaryTypographyProps={{
              noWrap: true,
              typography: 'subtitle2',
            }}
            secondaryTypographyProps={{
              mt: 0.5,
              noWrap: true,
              component: 'span',
              variant: 'caption',
              color: 'text.secondary',
            }}
          />
        </Card>
      )}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: (t) => t.spacing(2),
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Huỷ điểm danh"
        content="Bạn chắc chắn muốn huỷ?"
        action={
          <>
            {!isLoading && (
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleCancel();
                }}
              >
                Đồng ý
              </Button>
            )}
            {isLoading && (
              <Button variant="contained" disabled>
                <CircularProgress size={20} />
              </Button>
            )}
          </>
        }
      />
    </>
  );
}
