/* eslint-disable no-nested-ternary */
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import Label from 'src/components/label';
import { formatDMY } from 'src/utils/helper';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  index: number;
};

export default function ProfileTableRowView({ row, index }: Props) {
  const rowSchedule = row.schedule[0];

  return (
    <TableRow hover component="tr">
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={(index + 1 && 'secondary') || 'secondary'}
          sx={{ fontSize: 14 }}
        >
          {index + 1}
        </Label>
      </TableCell>

      <TableCell sx={{ display: 'flex' }}>
        <Avatar alt={rowSchedule.class?.title || rowSchedule.classId?.title} sx={{ mr: 2 }}>
          {rowSchedule.class?.title[0]?.toLocaleUpperCase() ||
            rowSchedule.classId?.title[0]?.toLocaleUpperCase()}
        </Avatar>

        <ListItemText
          primary={
            <strong>
              {rowSchedule.class?.title?.toLocaleUpperCase() ||
                rowSchedule.classId?.title?.toLocaleUpperCase()}
            </strong>
          }
          primaryTypographyProps={{ typography: 'body2' }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={
            rowSchedule?.type === 'regular'
              ? 'success'
              : rowSchedule?.type
                ? 'secondary'
                : 'primary'
          }
          sx={{ fontSize: 14 }}
        >
          {rowSchedule?.classId?.time_shift?.start_time?.slice(0, 5) ||
            rowSchedule?.time_shift?.start_time?.slice(0, 5)}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={
            rowSchedule?.type === 'regular'
              ? 'success'
              : rowSchedule?.type
                ? 'secondary'
                : 'primary'
          }
          sx={{ fontSize: 14 }}
        >
          {rowSchedule?.classId?.time_shift?.end_time?.slice(0, 5) ||
            rowSchedule?.time_shift?.end_time?.slice(0, 5)}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={
            rowSchedule?.type === 'regular'
              ? 'success'
              : rowSchedule?.type
                ? 'secondary'
                : 'primary'
          }
          sx={{ fontSize: 14 }}
        >
          {formatDMY(rowSchedule.date_created)}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={
            rowSchedule?.type === 'regular'
              ? 'success'
              : rowSchedule?.type
                ? 'secondary'
                : 'primary'
          }
          sx={{ fontSize: 14 }}
        >
          {rowSchedule?.type
            ? rowSchedule?.type === 'regular'
              ? 'Học đúng lịch'
              : 'Học bù'
            : 'Vắng'}
        </Label>
      </TableCell>
    </TableRow>
  );
}
