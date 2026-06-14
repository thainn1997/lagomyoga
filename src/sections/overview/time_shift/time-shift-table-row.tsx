import useSWR from 'swr';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { fetcher } from 'src/utils/axios';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ITimeShift } from 'src/types/time-shift';

import TimeShiftFormEditView from './time-shift-form-edit-view';

// ----------------------------------------------------------------------

type Props = {
  row: ITimeShift;
  index: number;
  user: any;
};

export default function TimeShiftTableRow({ row, index, user }: Props) {
  const { start_time, end_time, id } = row;

  const { mutate } = useSWR('/items/time_shift/', fetcher);

  const quickEdit = useBoolean();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteTimeShift = async (idTime: string) => {
    try {
      await axiosInstance.delete(`/items/time_shift/${idTime}`);
      confirm.onFalse();
      mutate();
      enqueueSnackbar('Xoá thành công', { variant: 'success' });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TableRow
        hover
        component="tr"
        onClick={() => {
          if (user?.role !== 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad') return;
          quickEdit.onTrue();
        }}
      >
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={(index + 1 && 'info') || 'default'} sx={{ fontSize: 14 }}>
            {index + 1}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={(start_time && 'error') || 'default'} sx={{ fontSize: 14 }}>
            {start_time?.slice(0, 5)}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={(end_time && 'warning') || 'default'} sx={{ fontSize: 14 }}>
            {end_time?.slice(0, 5)}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && (
            <Tooltip title="Xoá" placement="top" arrow sx={{ ml: 1 }}>
              <IconButton
                sx={{ color: 'error.main' }}
                onClick={(e) => {
                  e.stopPropagation();
                  confirm.onTrue();
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <TimeShiftFormEditView
        currentTimeShift={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xoá"
        content={`Bạn chắc chắn muốn xoá thời gian "${start_time?.slice(0, 5)} - ${end_time?.slice(0, 5)}" ?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteTimeShift(id);
            }}
          >
            Xoá
          </Button>
        }
      />
    </>
  );
}
