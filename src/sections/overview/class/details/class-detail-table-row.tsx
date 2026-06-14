import useSWR from 'swr';
import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Box, Button, CircularProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { fetcher } from 'src/utils/axios';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IClassProps, IDirectusUser } from 'src/types/class';

import ClassEditDayStudyView from './class-edit-day-study-view';
import ClassChangeStudentView from './class-change-student-view';

// ----------------------------------------------------------------------

type Props = {
  row: IDirectusUser;
  index: number;
  idParams: any;
  dataTable: IClassProps;
  user: any;
};

export default function ClassDetailRow({ row, index, idParams, dataTable, user }: Props) {
  const { directus_users_id, id, day_studies } = row;

  const [isLoading, setIsLoading] = useState(false);

  const confirm = useBoolean();

  const popover = usePopover();

  const activeDayStudy = useBoolean();

  const activeChange = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useSWR(
    `/items/class/${idParams}?fields=*,time_shift.*,students.id,students.day_studies,students.directus_users_id.*,teacher.*`,
    fetcher
  );

  const { mutate: mutateClass } = useSWR(
    '/items/class?fields=*,time_shift.*,students.directus_users_id.*,teacher.*',
    fetcher
  );

  const deleteScheduleReceipt = async (id_class: string, id_user: string) => {
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
      const dataDelete = result.data[0];
      const schedule = dataDelete.schedule.filter((x: any) => x.classId !== id_class);
      dataDelete.schedule = schedule;
      await axiosInstance.patch(`/items/receipt/${dataDelete.id}`, {
        schedule: dataDelete.schedule,
      });
    }
  };

  const handleDelete = async (idUser: any, class_id: any, id_directus_user: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.patch(`/items/class/${class_id}`, {
        students: {
          delete: [idUser],
        },
      });
      deleteScheduleReceipt(class_id, id_directus_user);
      enqueueSnackbar('Xoá thành công', { variant: 'success' });
      mutate();
      mutateClass();
      confirm.onFalse();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <TableRow hover component="tr" onClick={activeDayStudy.onTrue}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" sx={{ fontSize: 14 }}>
            {index + 1}
          </Label>
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={directus_users_id?.first_name[0]} sx={{ mr: 2 }}>
            {directus_users_id?.first_name[0]}
          </Avatar>

          <ListItemText
            primary={
              <strong>{`${directus_users_id?.first_name} ${directus_users_id?.last_name}`}</strong>
            }
            secondary={directus_users_id?.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(day_studies && 'warning') || 'default'}
            sx={{ fontSize: 14 }}
          >
            {day_studies?.sort().join(' - ') || dataTable.day.sort().join(' - ')}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && (
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={(e) => {
                e.stopPropagation();
                popover.onOpen(e);
              }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      <ClassEditDayStudyView
        mutate={mutate}
        currentClass={row}
        open={activeDayStudy.value}
        onClose={activeDayStudy.onFalse}
        idParams={idParams}
        dataTable={dataTable}
      />

      <ClassChangeStudentView
        mutate={mutate}
        currentClass={row}
        open={activeChange.value}
        onClose={activeChange.onFalse}
        idParams={idParams}
        dataTable={dataTable}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          <strong>Xoá</strong>
        </MenuItem>
        <MenuItem
          onClick={() => {
            activeChange.onTrue();
          }}
          sx={{ color: 'info.main' }}
        >
          <Iconify icon="mdi:exchange" />
          <strong>Chuyển lớp</strong>
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xoá"
        content={`Bạn chắc chắn muốn xoá học sinh "${directus_users_id?.first_name} ${directus_users_id?.last_name}" ?`}
        action={
          <>
            {!isLoading && (
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDelete(id, idParams, directus_users_id?.id);
                }}
              >
                <Box>Xoá</Box>
              </Button>
            )}
            {isLoading && (
              <Button variant="contained" disabled>
                <CircularProgress size={20} />
              </Button>
            )}
          </>
        }
      />
    </>
  );
}
