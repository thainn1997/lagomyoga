import React, { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';
import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { renderImageById } from 'src/utils/helper';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { IClassProps } from 'src/types/class';
import { IStudentsWithAttendance } from 'src/types/attendance';

import AttendanceWidget from './attendance-widget';
import AttendanceListWattingCard from './attendance-list-waiting';
import AttendanceCardActiveWaiting from './attendance-card-active-waiting';

type IProps = {
  currenClass: IClassProps;
  userAttendanceLogs: IStudentsWithAttendance[];
  mutateAttendance: VoidFunction;
  userActiveAdd: any;
  userAwaiting: any;
};

// ----------------------------------------------------------------------

export default function AttendanceCard({
  currenClass,
  userAttendanceLogs,
  userActiveAdd,
  userAwaiting,
  mutateAttendance,
}: IProps) {
  const theme = useTheme();

  const currentPresent = userAttendanceLogs.filter((item: any) => item.attendanceLogs);

  const { title, day, time_shift, id, teacher } = currenClass;

  const [count, setCount] = useState(currentPresent.length);

  useEffect(() => {
    setCount(currentPresent.length);
    if (count < 0) {
      setCount(currentPresent.length);
    }
  }, [currentPresent, count]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Box>
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
                  <strong>•&ensp;{title?.toUpperCase()}</strong>
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
                  •&ensp;{day?.sort().join('-')}
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
                total={`${count}/${userAttendanceLogs.length + userActiveAdd.length}`}
                icon="solar:user-rounded-bold"
                chart={{
                  series:
                    userAttendanceLogs.length === 0
                      ? 0
                      : Number(
                          (count / (userAttendanceLogs.length + userActiveAdd.length)) * 100
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
          {userAttendanceLogs.map((item) => (
            <ItemCard
              key={item.directus_users_id.id}
              item={item}
              idClass={id}
              idTime={time_shift.id}
              count={count}
              setCount={setCount}
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
            <AttendanceCardActiveWaiting
              key={item.id}
              item={item}
              setCount={setCount}
              mutateAttendance={mutateAttendance}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          ))}
        </Box>
      </Box>
      <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />
      <AttendanceListWattingCard
        userAwaiting={userAwaiting}
        idClass={id}
        idTime={time_shift.id}
        setCount={setCount}
        mutateAttendance={mutateAttendance}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
    </>
  );
}

//------------------------------------------------------------------------------------------------

function ItemCard({
  item,
  idTime,
  count,
  setCount,
  idClass,
  mutateAttendance,
}: {
  item: IStudentsWithAttendance;
  idTime: string;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  idClass: string;
  mutateAttendance: VoidFunction;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const prevent = useRef(false);

  const { first_name, last_name, email, id, avatar } = item.directus_users_id;

  const idStudentAttendance = item.attendanceLogs?.id;

  const theme = useTheme();

  const confirm = useBoolean();

  const handleAttendance = async (student: any, time_shift: string) => {
    if (!item.attendanceLogs && !prevent.current) {
      try {
        setIsLoading(true);
        await axiosInstance.post('/items/student_attendance_log/', {
          student,
          time_shift,
          status: 'published',
          type: 'regular',
          class: idClass,
          date_created: new Date(),
        });
        prevent.current = true;
        mutateAttendance();
        setCount((prev) => prev + 1);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    if (item.attendanceLogs) {
      confirm.onTrue();
    }
  };

  const handleCancel = async (idLogs: any) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/items/student_attendance_log/${idLogs}`);
      setIsLoading(false);
      setCount((prev) => prev - 1);
      mutateAttendance();
      prevent.current = false;
      confirm.onFalse();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {!isLoading && (
        <Card
          component="div"
          onClick={() => {
            handleAttendance(id, idTime);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: (t) => t.spacing(3, 2, 3, 3),
            background:
              !isLoading && item.attendanceLogs ? alpha(theme.palette.grey[500], 0.3) : '',
            cursor: 'pointer',
          }}
        >
          <Badge
            overlap="circular"
            color={item.attendanceLogs ? 'success' : 'error'}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Iconify
                icon={
                  item.attendanceLogs
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
                  handleCancel(idStudentAttendance);
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
