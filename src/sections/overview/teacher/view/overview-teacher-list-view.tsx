'use client';

import useSWR from 'swr';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Card,
  Dialog,
  Avatar,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useAuth } from 'src/hooks/use-auth';
import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ConfirmDialog from 'src/components/custom-dialog/confirm-dialog';

import { IClassProps } from 'src/types/class';
import { IStudentUser } from 'src/types/student';

import TeacherListView from '../list/teacher-list-view';

// ----------------------------------------------------------------------

export default function TeacherOverviewListPage() {
  const settings = useSettingsContext();

  const [month, setMonth] = useState<dayjs.Dayjs | null>(dayjs());

  const [value, setValue] = useState<dayjs.Dayjs | null>(dayjs());

  const { role } = useAuth();

  const open = useBoolean();

  const roleName = ['Administrator', 'Teacher'];

  const idIsNotOneOf = [
    'f25487e8-3d00-43f9-8a12-6fcd8fcd50c0',
    '0ba6cd53-e6ef-460d-b8c1-aab20ca1b640',
    '19bc0e9d-ae39-4083-a4af-0be4b36e4dfc',
  ];

  const params = {
    _and: [
      { user_created: { _neq: 'f25487e8-3d00-43f9-8a12-6fcd8fcd50c0' } },
      { 'month(date_created)': { _eq: `${dayjs(month).month() + 1}` } },
      { 'year(date_created)': { _eq: dayjs(value).year() } },
      {
        user_created:
          role === 'Administrator'
            ? { role: { name: { _in: roleName } } }
            : { _eq: `$CURRENT_USER` },
      },
    ],
  };

  const { data: scheduleAttendanceTeacher, isLoading: loadingScheduleAttendanceTeacher } = useSWR(
    `/items/student_attendance_log?fields=*.*&limit=-1&groupBy=user_created,time_shift,class,day(date_created),month(date_created),year(date_created)&filter=${JSON.stringify(params)}`
  );

  const filterIdUnfollow = {
    _and: [
      { status: { _eq: 'active' } },
      { role: role === 'Administrator' ? { name: { _in: roleName } } : { _eq: `$CURRENT_ROLE` } },
      { id: { _nin: idIsNotOneOf } },
    ],
  };

  const {
    data: adminTeachers,
    isLoading: loadingTeaches,
    mutate: updateProfileTeacher,
  } = useSWR<IStudentUser[]>(
    `/users?fields=id,role,last_name,first_name,email,avatar&filter=${JSON.stringify(filterIdUnfollow)}`
  );

  const { data: classTimeShift, isLoading: loadingClassTimeShift } = useSWR<IClassProps[]>(
    '/items/class?fields=id,time_shift.*,title'
  );

  const scheduleAttendanceTeacherWithClassTimeShift = (scheduleAttendanceTeacher || []).map(
    (item: any) => {
      const info = (classTimeShift || []).find((element) => element.id === item.class);
      return { ...item, info };
    }
  );

  const result = (adminTeachers || [])?.map((item) => {
    const attendance = (scheduleAttendanceTeacherWithClassTimeShift || []).filter(
      (element: any) => element.user_created === item.id
    );
    return { ...item, attendance };
  });

  const teacherList = (adminTeachers || []).filter(
    (item) => item.role !== 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad'
  );

  const handleOpen = () => {
    open.onTrue();
  };

  if (loadingClassTimeShift || loadingTeaches || loadingScheduleAttendanceTeacher)
    return <SplashScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Giáo viên"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          { name: 'Quản lý giáo viên', href: paths.dashboard.teacher.root },
          { name: 'Danh sách' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          role === 'Administrator' && (
            <Button variant="contained" color="success" onClick={handleOpen}>
              Danh sách giáo viên
            </Button>
          )
        }
      />

      <Box display="flex" gap={3} mb={3}>
        <DatePicker
          views={['month']}
          label="Tháng"
          value={dayjs(month)}
          onChange={(newValue) => {
            setMonth(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />

        <DatePicker
          views={['year']}
          label="Năm"
          value={dayjs(value)}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />
      </Box>
      <TeacherResult result={result} />
      <TeacherDialog
        open={open.value}
        onClose={open.onFalse}
        data={teacherList}
        updateProfileTeacher={updateProfileTeacher}
      />
    </Container>
  );
}

//------------------------------------------------
function TeacherResult({ result }: any) {
  return (
    <>
      {(result || []).map((item: any, index: any) => (
        <TeacherListView key={item.attendance.length + index} result={item} />
      ))}
    </>
  );
}

type IDialogProps = {
  open: boolean;
  onClose: () => void;
  data: any;
  updateProfileTeacher: (data: any, options?: any) => void;
};

const TeacherDialog = ({ open, onClose, data, updateProfileTeacher }: IDialogProps) => (
  <Dialog
    open={open}
    fullWidth
    maxWidth={false}
    PaperProps={{
      sx: { maxWidth: 520, height: 420 },
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
        sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
      >
        Danh sách giáo viên
      </Typography>
    </DialogActions>

    <Divider />

    <Scrollbar>
      <Box
        my={2}
        px={{ xs: 1, sm: 2 }}
        gap={3}
        display="grid"
        gridTemplateRows={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        {(data || []).map((item: any) => (
          <TeacherPatch
            key={item.id}
            item={item}
            onClose={onClose}
            updateProfileTeacher={updateProfileTeacher}
          />
        ))}
      </Box>
    </Scrollbar>
  </Dialog>
);

const TeacherPatch = ({ item, onClose, updateProfileTeacher }: any) => {
  const confirm = useBoolean();

  const handlePatchTeacher = async () => {
    await axiosInstance.patch(`/users/${item.id}`, {
      status: 'draft',
    });
    await updateProfileTeacher();
    onClose();
    confirm.onFalse();
  };

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: (t) => t.spacing(2),
      }}
    >
      <Avatar alt={item.last_name} sx={{ width: 48, height: 48, mr: 2 }}>
        {item.last_name[0].toLocaleUpperCase()}
      </Avatar>

      <ListItemText
        primary={`${item.first_name} ${item.last_name}`}
        secondary={
          <>
            <Iconify
              icon="noto:closed-mailbox-with-raised-flag"
              width={16}
              sx={{ flexShrink: 0, mr: 0.5 }}
            />
            {item.email}
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

      <IconButton color="info" onClick={confirm.onTrue} sx={{ flexShrink: 0, ml: 1.5 }}>
        <Iconify icon="heroicons:user-minus" />
      </IconButton>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xoá giáo viên"
        content="Bạn chắc chắn muốn thay đổi?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handlePatchTeacher();
            }}
          >
            Đồng ý
          </Button>
        }
      />
    </Card>
  );
};
