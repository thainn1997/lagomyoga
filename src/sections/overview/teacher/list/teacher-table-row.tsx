import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { renderImageById } from 'src/utils/helper';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  index: number;
  lastName: string;
  firstName: string;
  avatar: string;
};

export default function TeacherTableRow({ row, index, lastName, firstName, avatar }: Props) {
  const { date_created_day, date_created_month, date_created_year } = row;
  // const { title, time_shift } = row.info;

  return (
    <TableRow hover component="tr">
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color={(index + 1 && 'info') || 'default'} sx={{ fontSize: 14 }}>
          {index + 1}
        </Label>
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={lastName[0]}
          sx={{ mr: 2 }}
          src={renderImageById(avatar, lastName[0].toLocaleUpperCase())}
        />
        <ListItemText
          primary={
            <strong>
              {` ${firstName}
                ${lastName}`}
            </strong>
          }
          primaryTypographyProps={{ typography: 'body2', whiteSpace: 'nowrap' }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={<strong>{row?.info?.title}</strong>}
          primaryTypographyProps={{ typography: 'body2' }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={
            <strong>{`${row?.info?.time_shift?.start_time.slice(0, 5)} - ${row?.info?.time_shift?.end_time.slice(0, 5)}`}</strong>
          }
          primaryTypographyProps={{ typography: 'body2' }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={
            <strong>{`${date_created_day} - ${date_created_month} - ${date_created_year}`}</strong>
          }
          primaryTypographyProps={{ typography: 'body2' }}
        />
      </TableCell>
    </TableRow>
  );
}
