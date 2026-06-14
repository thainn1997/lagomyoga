import useSWR from 'swr';
import dayjs from 'dayjs';
import React from 'react';

import Box from '@mui/material/Box';

import { fetcher } from 'src/utils/axios';

import SplashScreen from 'src/components/loading-screen/splash-screen';

import NotFoundView from 'src/sections/error/not-found-view';

import { IClassProps } from 'src/types/class';
import { IStudentUser } from 'src/types/student';
import { IAttendanceLog } from 'src/types/attendance';

import AttanceListDetailView from './attendance-list-detail-view';

type IProps = {
  historyClass: IClassProps;
  date: string;
};

const ROLE_ADMIN = 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad';
const ROLE_TEACHER = 'abd577a9-620f-4b26-8045-1b46485f501f';

//-------------------------------------------------

export default function AttanceListDetailMainView({ historyClass, date }: IProps) {
  const { students } = historyClass;

  const timeShiftCurrent = JSON.stringify(historyClass.time_shift.id);

  const resultDay = dayjs(date).format('DD-MM-YYYY').split('-');

  const studentsFilter = students.filter((item) => item.directus_users_id !== null);

  const filter = {
    _and: [
      { 'day(date_created)': { _eq: resultDay[0] } },
      { 'month(date_created)': { _eq: resultDay[1] } },
      { 'year(date_created)': { _eq: resultDay[2] } },
      { time_shift: { _eq: timeShiftCurrent } },
    ],
  };

  const { data, error, isLoading, mutate } = useSWR<IAttendanceLog[]>(
    `/items/student_attendance_log?fields=*&filter=${JSON.stringify(filter)}`,
    fetcher
  );

  const {
    data: studentAwaiting,
    error: errorStudentAwaiting,
    isLoading: isLoadingStudentAwaiting,
  } = useSWR<IStudentUser[]>('/users', fetcher);

  const studentAwaitingFilter = (studentAwaiting || []).filter(
    (user) =>
      user?.role !== ROLE_ADMIN &&
      user?.role !== ROLE_TEACHER &&
      user.first_name !== null &&
      user.last_name !== null &&
      user?.role !== null
  );

  const studentFilterWithAttendanceLog = (studentsFilter || []).map((user) => {
    const attendanceLogs = (data || []).find(
      (attendance) => attendance.student === user.directus_users_id.id
    );
    return { ...user, attendanceLogs };
  });

  const studentFilterAwaitingAdd = (data || []).map((item) => {
    const directus_users_id = studentAwaitingFilter.find((student) => student.id === item.student);
    return { ...item, directus_users_id };
  });

  const studentActiveFilterWithStudentInClass = (studentFilterAwaitingAdd || []).filter(
    (value) =>
      !studentFilterWithAttendanceLog.find(
        (value2) => value.directus_users_id?.id === value2.directus_users_id.id
      )
  );

  const studentAwaitingFilterWithstudentsFilter = (studentAwaitingFilter || []).filter(
    (value) =>
      !studentFilterWithAttendanceLog.find((value2) => value2.directus_users_id.id === value.id)
  );

  const studentOutsiteClass = (studentAwaitingFilterWithstudentsFilter || []).filter(
    (value) =>
      !studentActiveFilterWithStudentInClass.find(
        (value2) => value.id === value2.directus_users_id?.id
      )
  );

  //----------

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;
  if (errorStudentAwaiting) return <NotFoundView />;
  if (isLoadingStudentAwaiting) return <SplashScreen />;

  return (
    <Box pb={3}>
      <AttanceListDetailView
        date={date}
        historyClass={historyClass}
        userAttendanceLogs={studentFilterWithAttendanceLog}
        userActiveAdd={studentActiveFilterWithStudentInClass}
        userAwaiting={studentOutsiteClass}
        mutateAttendance={mutate}
      />
    </Box>
  );
}
