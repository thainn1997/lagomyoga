'use client';

import useSWR from 'swr';
import React from 'react';
import dayjs from 'dayjs';

import { Box } from '@mui/material';

import { fetcher } from 'src/utils/axios';

import { SplashScreen } from 'src/components/loading-screen';

import { NotFoundView } from 'src/sections/error';

import { IClassProps } from 'src/types/class';
import { IStudentUser } from 'src/types/student';
import { IAttendanceLog } from 'src/types/attendance';

import AttendanceCard from './attendance-card';

type IProps = {
  currenClass: IClassProps;
};

//------------------------------------------------------------------------------

export default function AttendanceListCard({ currenClass }: IProps) {
  const { students } = currenClass;
  const timeShiftCurrent = JSON.stringify(currenClass.time_shift.id);

  const startDate = dayjs().startOf('day').toISOString();

  const endDate = dayjs().add(1, 'day').endOf('day').toISOString();

  const studentsFilter = students.filter(
    (item) =>
      item.directus_users_id !== null &&
      item.directus_users_id?.first_name !== null &&
      item.directus_users_id?.last_name !== null &&
      item.directus_users_id?.email !== null
  );

  const {
    data: studentAwaiting,
    error: errorStudentAwaiting,
    isLoading: isLoadingStudentAwaiting,
  } = useSWR<IStudentUser[]>(
    '/users?fields=id,first_name,last_name,email,role.name&filter[role][name][_contains]=Student&limit=-1',
    fetcher
  );

  const filter = {
    _and: [
      { date_created: { _between: [startDate, endDate] } },
      { time_shift: { _eq: timeShiftCurrent } },
    ],
  };

  const { data, error, isLoading, mutate } = useSWR<IAttendanceLog[]>(
    `/items/student_attendance_log?filter=${JSON.stringify(filter)}`,
    fetcher
  );

  const studentFilterWithAttendanceLog = (studentsFilter || []).map((user) => {
    const attendanceLogs = (data || []).find(
      (attendance) => attendance.student === user.directus_users_id.id
    );
    return { ...user, attendanceLogs };
  });
  const studentFilterAwaitingAdd = (data || []).map((item) => {
    const directus_users_id = (studentAwaiting || []).find(
      (student) => student.id === item.student
    );
    return { ...item, directus_users_id };
  });

  const studentActiveFilterWithStudentInClass = (studentFilterAwaitingAdd || []).filter(
    (value) =>
      !studentFilterWithAttendanceLog.find(
        (value2) => value.directus_users_id?.id === value2.directus_users_id.id
      )
  );

  const studentAwaitingFilterWithstudentsFilter = (studentAwaiting || []).filter(
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

  if (errorStudentAwaiting) return <NotFoundView />;
  if (isLoadingStudentAwaiting) return <SplashScreen />;
  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <Box>
      <AttendanceCard
        currenClass={currenClass}
        userAttendanceLogs={studentFilterWithAttendanceLog}
        userActiveAdd={studentActiveFilterWithStudentInClass}
        userAwaiting={studentOutsiteClass}
        mutateAttendance={mutate}
      />
    </Box>
  );
}
