import React from 'react';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { IClassProps } from 'src/types/class';

import ClassDetailListAddStudent from './class-detail-list-add-student';

type IProps = {
  dataHead: IClassProps;
  user: any;
};

//---------------------------------------------------

export default function ClassDetailHeadView({ dataHead, user }: IProps) {
  const { students } = dataHead;

  const studentsFilter = students.filter(
    (item) =>
      item?.directus_users_id !== null &&
      item?.directus_users_id?.id !== null &&
      item?.directus_users_id?.first_name !== null &&
      item?.directus_users_id?.last_name !== null
  );

  const action = useBoolean();
  return (
    <>
      <Box
        rowGap={3}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
      >
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Lớp học
          </Typography>
          <strong>•&ensp;{dataHead?.title?.toUpperCase()}</strong>
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Giáo viên
          </Typography>

          {dataHead?.teacher ? (
            <strong>
              •&ensp;
              {`${dataHead?.teacher?.first_name.toLocaleUpperCase()} ${dataHead?.teacher?.last_name.toLocaleUpperCase()}`}
            </strong>
          ) : (
            'Chưa có'
          )}
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Ngày học
          </Typography>
          •&ensp;{dataHead?.day?.sort().join('-')}
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Thời gian học
          </Typography>
          •&ensp;
          {`${dataHead?.time_shift?.start_time.slice(
            0,
            5
          )} - ${dataHead?.time_shift?.end_time.slice(0, 5)}`}
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Học sinh tham gia
          </Typography>
          •&ensp;{studentsFilter?.length} học sinh
        </Stack>

        {user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && (
          <Stack>
            <Button
              variant="contained"
              color="error"
              sx={{ width: 'fit-content' }}
              onClick={action.onTrue}
            >
              Thêm học viên
            </Button>
          </Stack>
        )}
      </Box>
      <ClassDetailListAddStudent
        open={action.value}
        onClose={action.onFalse}
        dataClass={dataHead}
      />
    </>
  );
}
