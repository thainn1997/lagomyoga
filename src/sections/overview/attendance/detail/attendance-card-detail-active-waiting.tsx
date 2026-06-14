import React from 'react';

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { Button, ListItemText } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { renderImageById } from 'src/utils/helper';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

type IProps = {
  item: any;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  mutateAttendance: VoidFunction;
};

//-----------------------------------------------------

export default function AttendanceCardDetailActiveWaiting({
  item,
  setCount,
  mutateAttendance,
}: IProps) {
  const { directus_users_id, id } = item;

  const theme = useTheme();

  const confirm = useBoolean();

  const handleCancel = async () => {
    try {
      await axiosInstance.delete(`/items/student_attendance_log/${id}`);
      mutateAttendance();
      confirm.onFalse();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
              icon={item ? 'eva:diagonal-arrow-right-up-fill' : 'eva:diagonal-arrow-left-down-fill'}
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
            alt={directus_users_id?.last_name}
            src={renderImageById(
              directus_users_id?.avatar,
              directus_users_id?.last_name[0]?.toLocaleUpperCase()
            )}
            sx={{ width: 48, height: 48 }}
          />
        </Badge>
        <ListItemText
          primary={`${directus_users_id?.first_name} ${directus_users_id?.last_name}`}
          secondary={
            <>
              <Iconify
                icon="noto:closed-mailbox-with-raised-flag"
                width={16}
                sx={{ flexShrink: 0, mr: 0.5 }}
              />
              {directus_users_id?.email}
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
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Huỷ điểm danh"
        content="Bạn chắc chắn muốn huỷ?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCancel();
            }}
          >
            Đồng ý
          </Button>
        }
      />
    </>
  );
}
