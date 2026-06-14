import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { renderImageById } from 'src/utils/helper';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IStudentUser } from 'src/types/student';

import StudentUpdateForm from './student-form-update';

// ----------------------------------------------------------------------

type Props = {
  row: IStudentUser;
  onDeleteRow: VoidFunction;
  onEditRow: VoidFunction;
  index: number;
  user: any;
};

export default function StudentTableRow({ row, index, onDeleteRow, onEditRow, user }: Props) {
  const { first_name, last_name, email, avatar } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow
        hover
        component="tr"
        onClick={() => {
          onEditRow();
        }}
      >
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={(index + 1 && 'info') || 'default'} sx={{ fontSize: 14 }}>
            {index + 1}
          </Label>
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={last_name[0]}
            sx={{ mr: 2 }}
            src={renderImageById(avatar, last_name[0].toLocaleUpperCase())}
          />
          <ListItemText
            primary={
              <strong>
                {` ${first_name}
                ${last_name}`}
              </strong>
            }
            primaryTypographyProps={{ typography: 'body2', whiteSpace: 'nowrap' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={email}
            primaryTypographyProps={{
              typography: 'body2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '200px',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText primary="Học viên" primaryTypographyProps={{ typography: 'body2' }} />
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

      <StudentUpdateForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            quickEdit.onTrue();
          }}
          sx={{ color: 'primary.main' }}
        >
          <Iconify icon="solar:pen-bold" />
          <strong>Chỉnh sửa</strong>
        </MenuItem>

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
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xoá"
        content={`Bạn chắc chắn muốn xoá học sinh "${first_name} ${last_name}" ?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xoá
          </Button>
        }
      />
    </>
  );
}
