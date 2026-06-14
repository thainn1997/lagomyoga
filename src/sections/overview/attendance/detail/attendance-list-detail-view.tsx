import dayjs from 'dayjs';
import React, { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { Box, Stack, Button, Divider, Typography, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { renderImageById } from 'src/utils/helper';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { IClassProps } from 'src/types/class';

import AttendanceWidget from '../list/attendance-widget';
import AttendanceListDetailWattingCard from './attance-list-detail-waiting';
import AttendanceCardDetailActiveWaiting from './attendance-card-detail-active-waiting';

type IProps = {
  historyClass: IClassProps;
  userAttendanceLogs: any;
  userActiveAdd: any;
  userAwaiting: any;
  mutateAttendance: VoidFunction;
  date: string;
};

//-------------------------------------------------

export default function AttanceListDetailView({
  date,
  historyClass,
  userAttendanceLogs,
  userActiveAdd,
  userAwaiting,
  mutateAttendance,
}: IProps) {
  const theme = useTheme();

  const { title, time_shift, day, teacher, id } = historyClass;

  const currentPresent = userAttendanceLogs.filter((item: any) => item.attendanceLogs);

  const [count, setCount] = useState(currentPresent.length);

  useEffect(() => {
    setCount(currentPresent.length);
    if (count < 0) {
      setCount(currentPresent.length);
    }
  }, [currentPresent, count]);

  return (
    <>
      <Card
        sx={{
          p: 2,
          ...bgGradient({
            color: alpha(
              theme.palette.background.default,
              theme.palette.mode === 'light' ? 0.9 : 0.2
            ),
            imgUrl: '/assets/background/overlay_3.jpg',
          }),
        }}
      >
        <Box
          rowGap={3}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box>
            <Box
              rowGap={3}
              display="grid"
              alignItems="center"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Stack sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Lớp học
                </Typography>
                <strong>
                  •&ensp;
                  {title?.toUpperCase()}
                </strong>
              </Stack>

              <Stack sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Giáo viên
                </Typography>
                {teacher ? (
                  <strong>
                    •&ensp;
                    {teacher?.first_name?.toUpperCase()}&ensp;
                    {teacher?.last_name?.toUpperCase()}
                  </strong>
                ) : (
                  'Chưa có'
                )}
              </Stack>

              <Stack sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Ngày học
                </Typography>
                •&ensp;
                {day?.sort().join('-')}
              </Stack>

              <Stack sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Thời gian học
                </Typography>
                •&ensp;
                {`${time_shift?.start_time.slice(0, 5)} - ${time_shift?.end_time.slice(0, 5)}`}
              </Stack>
            </Box>
          </Box>

          <Box>
            <AttendanceWidget
              title="Học viên có mặt"
              total={`${count + userActiveAdd.length}/${userAttendanceLogs.length + userActiveAdd.length}`}
              icon="solar:user-rounded-bold"
              chart={{
                series:
                  userAttendanceLogs.length === 0
                    ? 0
                    : Number(
                        ((count + userActiveAdd.length) /
                          (userAttendanceLogs.length + userActiveAdd.length)) *
                          100
                      ).toFixed(1),
              }}
            />
          </Box>
        </Box>
      </Card>
      <Box px={10} py={3}>
        <Divider />
      </Box>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {userAttendanceLogs.map((element: any) => (
          <ItemCard
            date={date}
            key={element.directus_users_id.id}
            element={element}
            count={count}
            setCount={setCount}
            idClass={id}
            idTimeShift={time_shift.id}
            mutateAttendance={mutateAttendance}
          />
        ))}
      </Box>

      <Box
        mt={3}
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {(userActiveAdd || []).map((item: any) => (
          <AttendanceCardDetailActiveWaiting
            key={item.id}
            item={item}
            setCount={setCount}
            mutateAttendance={mutateAttendance}
          />
        ))}
      </Box>
      <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
      <AttendanceListDetailWattingCard
        date={date}
        userAwaiting={userAwaiting}
        idClass={id}
        idTime={time_shift.id}
        setCount={setCount}
        mutateAttendance={mutateAttendance}
      />
    </>
  );
}

//--------------------------------------------------------

function ItemCard({
  element,
  setCount,
  count,
  idClass,
  idTimeShift,
  date,
  mutateAttendance,
}: {
  date: string;
  element: any;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  idClass: string;
  idTimeShift: string;
  mutateAttendance: VoidFunction;
}) {
  const theme = useTheme();

  const prevent = useRef(false);

  const { last_name, first_name, email, id, avatar } = element.directus_users_id;

  const idStudentAttendance = element.attendanceLogs?.id;

  const confirm = useBoolean();
  const handleAttendance = async (student: any, time_shift: string) => {
    if (!element.attendanceLogs && !prevent.current) {
      try {
        await axiosInstance.post('/items/student_attendance_log/', {
          student,
          time_shift,
          status: 'published',
          type: 'regular',
          class: idClass,
          date_created: dayjs(date).toISOString(),
        });
        mutateAttendance();
        prevent.current = true;
        setCount((prev) => prev + 1);
      } catch (error) {
        console.log(error);
      }
    }
    if (element.attendanceLogs) {
      confirm.onTrue();
    }
  };

  const handleCancel = async (idLogs: any) => {
    try {
      await axiosInstance.delete(`/items/student_attendance_log/${idLogs}`);
      setCount((prev) => prev - 1);
      mutateAttendance();
      prevent.current = false;
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
          handleAttendance(id, idTimeShift);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: (t) => t.spacing(3, 2, 3, 3),
          background: element.attendanceLogs && alpha(theme.palette.grey[500], 0.3),
          cursor: 'pointer',
        }}
      >
        <Badge
          overlap="circular"
          color={element.attendanceLogs ? 'success' : 'error'}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Iconify
              icon={
                element.attendanceLogs
                  ? 'eva:diagonal-arrow-right-up-fill'
                  : 'eva:diagonal-arrow-left-down-fill'
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
            alt={last_name}
            src={renderImageById(avatar, last_name[0].toLocaleUpperCase())}
            sx={{ width: 48, height: 48 }}
          />
        </Badge>
        <ListItemText
          primary={`${first_name} ${last_name}`}
          secondary={
            <>
              <Iconify
                icon="noto:closed-mailbox-with-raised-flag"
                width={16}
                sx={{ flexShrink: 0, mr: 0.5 }}
              />
              {email}
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
              handleCancel(idStudentAttendance);
            }}
          >
            Đồng ý
          </Button>
        }
      />
    </>
  );
}
