import React, { useRef, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { Box, Typography, ListItemText } from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { renderImageById } from 'src/utils/helper';

import Iconify from 'src/components/iconify';

import { IStudentUser, IStudentTableFilters, IStudentTableFilterValue } from 'src/types/student';

import AttendanceToolbar from '../list/attendance-toolbar';

type IProps = {
  date: string;
  userAwaiting: IStudentUser[];
  idClass: string;
  idTime: string;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  mutateAttendance: VoidFunction;
};
const defaultFilters: IStudentTableFilters = {
  first_name: '',
  last_name: '',
};

// ----------------------------------------------------------------------

export default function AttendanceListDetailWattingCard({
  date,
  userAwaiting,
  idClass,
  idTime,
  setCount,
  mutateAttendance,
}: IProps) {
  const [filters, setFilters] = useState(defaultFilters);

  const prevent = useRef(false);

  const dataFiltered = applyFilter({
    inputData: userAwaiting,
    filters,
  });

  const handleFilters = useCallback((name: string, value: IStudentTableFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const hanldeOnClickAddStudent = async (
    id_class: string,
    id: string,
    first_name: string,
    last_name: string
  ) => {
    if (!prevent.current) {
      try {
        const data = {
          student: id,
          time_shift: idTime,
          status: 'published',
          type: 'makeup',
          class: idClass,
          date_created: date,
        };
        await axiosInstance.post('/items/student_attendance_log/', data);
        prevent.current = true;
        mutateAttendance();
        setTimeout(() => {
          prevent.current = false;
        }, 10);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Typography variant="subtitle2" sx={{ mt: 3, textTransform: 'uppercase' }}>
        Danh sách học viên ngoài lớp học
      </Typography>

      <AttendanceToolbar filters={filters} onFilters={handleFilters} />

      <Box
        mt={2}
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {dataFiltered.map((element) => (
          <Card
            key={element.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: (t) => t.spacing(3, 2, 3, 3),
              cursor: 'pointer',
            }}
            onClick={() => {
              hanldeOnClickAddStudent(idClass, element.id, element.first_name, element.last_name);
            }}
          >
            <Badge
              overlap="circular"
              color="error"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={<Iconify icon="humbleicons:user-add" width={16} />}
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  p: 0,
                  width: 20,
                },
                mr: 2,
              }}
            >
              <Avatar
                alt={element.last_name}
                src={renderImageById(element.avatar, element.last_name[0].toLocaleUpperCase())}
                sx={{ width: 48, height: 48 }}
              />
            </Badge>
            <ListItemText
              primary={`${element.first_name} ${element.last_name}`}
              secondary={
                <>
                  <Iconify
                    icon="noto:closed-mailbox-with-raised-flag"
                    width={16}
                    sx={{ flexShrink: 0, mr: 0.5 }}
                  />
                  {element.email}
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
        ))}
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,

  filters,
}: {
  inputData: IStudentUser[];
  filters: IStudentTableFilters;
}) {
  const { last_name, first_name } = filters;

  if (last_name) {
    inputData = inputData.filter(
      (user) => user.last_name.toLowerCase().indexOf(last_name.toLowerCase()) !== -1
    );
  }

  if (first_name) {
    inputData = inputData.filter(
      (user) => user.first_name.toLowerCase().indexOf(first_name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
