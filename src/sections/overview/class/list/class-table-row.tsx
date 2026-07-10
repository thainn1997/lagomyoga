import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IClassProps } from 'src/types/class';

import ClassQuickEditForm from './class-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: IClassProps;
  onDeleteRow: VoidFunction;
  onEditRow: VoidFunction;
  index: number;
  user: any;
  teachers: any;
};

export default function ClassTableRow({
  row,
  index,
  onDeleteRow,
  onEditRow,
  user,
  teachers,
}: Props) {
  const { title, day, date_created, time_shift, students, teacher } = row;

  const studentsFilter = students.filter(
    (item) =>
      item?.directus_users_id !== null &&
      item?.directus_users_id.id !== null &&
      item?.directus_users_id.first_name !== null &&
      item?.directus_users_id.last_name !== null
  );

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const handleOnPopover = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    popover.onOpen(e);
  };

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

        <TableCell sx={{ display: 'flex' }}>
          <Avatar alt={title} sx={{ mr: 2 }}>
            {title[0].toLocaleUpperCase()}
          </Avatar>

          <ListItemText
            primary={<strong>{title.toLocaleUpperCase()}</strong>}
            secondary={`${studentsFilter.length} học viên`}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={(teacher && 'primary') || 'default'} sx={{ fontSize: 14 }}>
            {teacher
              ? `${teacher?.first_name.toLocaleUpperCase()} ${teacher?.last_name.toLocaleUpperCase()}`
              : ''}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(date_created && 'secondary') || 'default'}
            sx={{ fontSize: 14 }}
          >
            {fDate(date_created)}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={(day && 'warning') || 'default'} sx={{ fontSize: 14 }}>
            {day?.sort().join(' - ')}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(time_shift?.start_time && 'info') || 'default'}
            sx={{ fontSize: 14 }}
          >
            {time_shift?.start_time?.slice(0, 5)}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(time_shift?.end_time && 'success') || 'default'}
            sx={{ fontSize: 14 }}
          >
            {time_shift?.end_time?.slice(0, 5)}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && (
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={handleOnPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      <ClassQuickEditForm
        currentClass={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        teachers={teachers}
      />

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
        content={`Bạn chắc chắn muốn xoá lớp "${title.toLocaleUpperCase()}" ?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xoá
          </Button>
        }
      />
    </>
  );
}
