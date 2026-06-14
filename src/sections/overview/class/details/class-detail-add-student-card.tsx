'use client';

import useSWR from 'swr';
import dayjs from 'dayjs';
import React, { useState, SetStateAction } from 'react';

import ListItemText from '@mui/material/ListItemText';
import { Box, Card, Avatar, IconButton, CircularProgress } from '@mui/material';

import axiosInstance, { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';

import { IStudentUser } from 'src/types/student';
import { IClassTableFilterValue } from 'src/types/class';

type IProps = {
  item: IStudentUser;
  idClass: string;
  setMessSuccess: React.Dispatch<SetStateAction<string>>;
  day: [];
  onFilters: (last_name: string, value: IClassTableFilterValue) => void;
};

//------------------------------------------------------------------------------

export default function ClassDetailAddStudentCard({
  item,
  idClass,
  setMessSuccess,
  day,
  onFilters,
}: IProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useSWR(
    `/items/class/${idClass}?fields=*,time_shift.*,students.id,students.day_studies,students.directus_users_id.*,teacher.*`,
    fetcher
  );

  const { mutate: mutateClass } = useSWR(
    '/items/class?fields=*,time_shift.*,students.directus_users_id.*,teacher.*',
    fetcher
  );

  const handleResetFilter = () => onFilters('last_name', '');

  const renderCalander = (fromDate: Date, toDate: Date, listDay: string[]) => {
    const dayResults = [];
    const start = dayjs(fromDate);
    const end = dayjs(toDate);
    for (let m = dayjs(start); m.isBefore(end.add(1, 'days')); m = m.add(1, 'days')) {
      const d = m.day();
      const dayString = d === 0 ? 'CN' : (d + 1).toString();
      if (listDay.includes(dayString)) {
        dayResults.push({
          date: m.format('DD-MM-YYYY'),
          dayOfWeek: dayString,
        });
      }
    }
    return dayResults;
  };

  const updateScheduleReceipt = async (id_class: string, id_user: string, data: any) => {
    const filter = {
      _and: [
        {
          student: { _eq: id_user },
          status: { _eq: 'published' },
        },
      ],
    };
    const result = await axiosInstance.get(`/items/receipt?filter=${JSON.stringify(filter)}`);
    if (result.data.length > 0) {
      const dataUpdate = result.data[0];
      const dayResult = renderCalander(
        new Date(dataUpdate.start_date),
        new Date(dataUpdate.end_date),
        data.day
      );
      const scheduleUpdate = {
        userId: id_user,
        classId: id_class,
        data: dayResult,
      };
      dataUpdate.schedule.push(scheduleUpdate);
      await axiosInstance.patch(`/items/receipt/${dataUpdate.id}`, {
        schedule: dataUpdate.schedule,
      });
    }
  };

  const hanldeOnClickAddStudent = async (
    id: string,
    id_class: string,
    first_name: string,
    last_name: string
  ) => {
    try {
      setIsLoading(true);
      const data = await axiosInstance.patch(`/items/class/${id_class}`, {
        students: {
          create: [
            {
              directus_users_id: {
                id,
              },
              day_studies: day,
              class_id: id_class,
              class_old: id_class,
            },
          ],
        },
      });
      mutate();
      mutateClass();
      handleResetFilter();
      updateScheduleReceipt(id_class, id, data.data);
      setMessSuccess(`Thêm thành công ${first_name} ${last_name} vào lớp học`);
      setTimeout(() => setMessSuccess(''), 3000);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {!isLoading && (
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

          <IconButton
            color="info"
            onClick={() => {
              hanldeOnClickAddStudent(item.id, idClass, item.first_name, item.last_name);
            }}
            sx={{ flexShrink: 0, ml: 1.5 }}
          >
            <Iconify icon="lets-icons:user-add" />
          </IconButton>
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
    </>
  );
}
