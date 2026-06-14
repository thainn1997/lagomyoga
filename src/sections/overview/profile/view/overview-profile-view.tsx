'use client';

import useSWR from 'swr';
import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { Tab, Tabs, Divider, tabsClasses } from '@mui/material';

import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IClassProps } from 'src/types/class';
import { IReceipt, Schedule } from 'src/types/receipt';

import StudentProfileView from '../../student/detail/student-profile-view';
import StudentProfileSchedule from '../../student/detail/student-profile-schedule';
import StudentProfileHeadView from '../../student/detail/student-profile-head-view';
import StudentProfileReceiptView from '../../student/detail/student-profile-receipt-view';
import StudentProfileAttendanceView from '../../student/detail/student-profile-attendance-view';

type IProps = {
  profile: any;
  currentReceipt: IReceipt[];
  currentClass: IClassProps[];
  loadingReceipt: boolean;
};

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'schedule',
    label: 'Thời khóa biểu',
    icon: <Iconify icon="uim:schedule" width={24} />,
  },
  {
    value: 'attendance',
    label: 'Điểm danh',
    icon: <Iconify icon="material-symbols:book" width={24} />,
  },
  {
    value: 'profile',
    label: 'Thông tin',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'receipt',
    label: 'Học phí',
    icon: <Iconify icon="heroicons:credit-card-16-solid" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function OverviewProfileViewPage({
  profile,
  currentReceipt,
  currentClass,
  loadingReceipt,
}: IProps) {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('schedule');

  const receiptList = currentReceipt ?? [];

  const startDay = receiptList.map((item) => item.start_date);

  const startDate = startDay[0]
    ? dayjs(startDay[0]).subtract(1, 'day').startOf('day').toISOString()
    : dayjs().subtract(1, 'year').startOf('day').toISOString();

  const endDate = dayjs().add(1, 'day').endOf('day').toISOString();

  const filterAttendance = {
    _and: [{ date_created: { _between: [startDate, endDate] } }, { student: { _eq: profile.id } }],
  };

  const { data: currentAttandance } = useSWR(
    `/items/student_attendance_log?fields=*,class.*,time_shift.*&filter=${JSON.stringify(filterAttendance)}`
  );

  const filter = { _and: [{ student: { _eq: profile.id } }] };

  const { data } = useSWR(`/items/receipt?fields=*&sort=-id&filter=${JSON.stringify(filter)}`);

  const { data: dataClass } = useSWR(
    '/items/class?fields=*,time_shift.*,students.directus_users_id.*,teacher.*'
  );

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const calendarSchedules: Schedule[] = [];

  receiptList.forEach((item) => {
    (item.schedule ?? []).forEach((schedule) => {
      calendarSchedules.push({
        classId: schedule.classId,
        data: schedule.data,
        userId: schedule.userId,
      });
    });
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : '2xl'}>
      <CustomBreadcrumbs
        heading="Thông tin tài khoản"
        links={[
          {
            name: 'Trang chủ',
            href: paths.dashboard.root,
          },
          {
            name: 'Tài khoản',
            href: paths.dashboard.profile.root,
          },
          { name: `${profile?.first_name} ${profile?.last_name}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card
        sx={{
          borderRadius: 1,
        }}
      >
        <StudentProfileHeadView profile={profile} />
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
        <Divider />
        {currentTab === 'profile' && <StudentProfileView profile={profile} />}

        {currentTab === 'attendance' && (
          <StudentProfileAttendanceView
            schedule={calendarSchedules}
            dataClass={dataClass}
            currentAttandance={currentAttandance}
          />
        )}

        {currentTab === 'receipt' && <StudentProfileReceiptView allReceipt={data} />}
        {currentTab === 'schedule' && (
          <StudentProfileSchedule
            currentSchedule={calendarSchedules}
            currentClass={currentClass}
            loading={loadingReceipt}
          />
        )}
      </Card>
    </Container>
  );
}
