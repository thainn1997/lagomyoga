'use client';

import { Box } from '@mui/material';

import { IClassProps } from 'src/types/class';

import AttendanceListView from './attendance-list-view';

type IProps = {
  data: IClassProps[];
};

// ----------------------------------------------------------------------

export default function AttendanceMainView({ data }: IProps) {
  return (
    <Box>
      <Box>
        {data?.map((currenClass) => (
          <AttendanceListView key={currenClass.id} currenClass={currenClass} />
        ))}
      </Box>
    </Box>
  );
}
