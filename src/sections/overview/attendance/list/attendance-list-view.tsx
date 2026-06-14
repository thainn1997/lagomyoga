'use client';

import { Box } from '@mui/material';

import { IClassProps } from 'src/types/class';

import AttendanceListCard from './attendance-list-card';

type IProps = {
  currenClass: IClassProps;
};

// ----------------------------------------------------------------------

export default function AttendanceListView({ currenClass }: IProps) {
  return (
    <Box>
      <Box mb={4}>
        <AttendanceListCard currenClass={currenClass} />
      </Box>
    </Box>
  );
}
