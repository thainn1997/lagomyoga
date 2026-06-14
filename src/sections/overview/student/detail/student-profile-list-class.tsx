import useSWR from 'swr';

import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { fetcher } from 'src/utils/axios';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';

import { IClassProps } from 'src/types/class';

type IProps = {
  row: IClassProps;
  idProfile: string;
  onClose: VoidFunction;
};

//------------------------------------------------------

export default function StudentProfileListClass({ row, idProfile, onClose }: IProps) {
  const { title, date_created, day, students, time_shift, id } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useSWR(
    `/items/class?fields=*,time_shift.*,students.directus_users_id.*&filter[students][directus_users_id][id][_eq]=${idProfile}`,
    fetcher
  );

  const handleOnClick = async (classId: any, idUser: any) => {
    try {
      await axiosInstance.patch(`/items/class/${classId}`, {
        students: {
          create: [
            {
              directus_users_id: {
                id: idUser,
              },
            },
          ],
        },
      });
      mutate();
      onClose();
      enqueueSnackbar('Thêm thành công', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Thêm không thành công', { variant: 'error' });
      console.log(error);
    }
  };

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={title} sx={{ mr: 2 }}>
          {title[0].toLocaleUpperCase()}
        </Avatar>

        <ListItemText
          primary={<strong>{title.toLocaleUpperCase()}</strong>}
          secondary={`${students.length} học viên`}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
        <Label
          variant="soft"
          color={(date_created && 'secondary') || 'default'}
          sx={{ fontSize: 14 }}
        >
          {fDate(date_created)}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
        <Label variant="soft" color={(day && 'warning') || 'default'} sx={{ fontSize: 14 }}>
          {day?.sort().join(' - ')}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
        <Label
          variant="soft"
          color={(time_shift?.start_time && 'info') || 'default'}
          sx={{ fontSize: 14 }}
        >
          {time_shift?.start_time?.slice(0, 5)}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
        <Label
          variant="soft"
          color={(time_shift?.end_time && 'success') || 'default'}
          sx={{ fontSize: 14 }}
        >
          {time_shift?.end_time?.slice(0, 5)}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            handleOnClick(id, idProfile);
          }}
        >
          Thêm vào
        </Button>
      </TableCell>
    </TableRow>
  );
}
