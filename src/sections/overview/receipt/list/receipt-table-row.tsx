import useSWR from "swr";
import dayjs from "dayjs";

import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ListItemText from "@mui/material/ListItemText";
import { Button, Tooltip, IconButton } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { fCurrency } from "src/utils/format-number";
import axiosInstance, { fetcher } from "src/utils/axios";

import Label from "src/components/label";
import Iconify from "src/components/iconify/iconify";
import { useSnackbar } from "src/components/snackbar";
import ConfirmDialog from "src/components/custom-dialog/confirm-dialog";

import { IReceipt } from "src/types/receipt";

import ReceiptEditFormView from "./receipt-edit-form-view";
// ----------------------------------------------------------------------

type Props = {
  row: IReceipt;
  index: number;
};

export default function ReceiptTableRow({ row, index }: Props) {
  return <TableRowList index={index} row={row} />;
}

//-------------------------------------------------------------------------------
function TableRowList({ index, row }: { index: number; row: IReceipt }) {
  const {
    id,
    amount_received,
    date_created,
    start_date,
    end_date,
    total_sessions,
    duration,
  } = row;

  const quickEdit = useBoolean();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useSWR(
    "/items/receipt?fields=*,student.*&sort=-date_created&filter[status][_eq]=published",
    fetcher
  );

  const handleDelete = async (idReceipt: any) => {
    try {
      await axiosInstance.delete(`items/receipt/${idReceipt}`);
      mutate();
      enqueueSnackbar("Xoá thành công", { variant: "success" });
      confirm.onFalse();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Xoá không thành công", { variant: "error" });
    }
  };
  const user = row.student;

  return (
    <>
      <TableRow hover component="tr" onClick={quickEdit.onTrue}>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Label
            variant="soft"
            color={(index + 1 && "info") || "default"}
            sx={{ fontSize: 14 }}
          >
            {index + 1}
          </Label>
        </TableCell>

        <TableCell sx={{ display: "flex" }}>
          <Avatar alt={user?.last_name[0]} sx={{ mr: 2 }}>
            {user?.last_name[0].toLocaleUpperCase()}
          </Avatar>
          <ListItemText
            primary={
              <strong>
                {` ${user?.first_name}
                ${user?.last_name}`}
              </strong>
            }
            secondary={user?.email}
            primaryTypographyProps={{
              typography: "body2",
              whiteSpace: "nowrap",
            }}
            secondaryTypographyProps={{
              noWrap: true,
              component: "span",
              color: "text.disabled",
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Label
            variant="soft"
            color={(amount_received && "secondary") || "default"}
            sx={{ fontSize: 14 }}
          >
            {fCurrency(amount_received)} VND
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Label
            variant="soft"
            color={(date_created && "error") || "default"}
            sx={{ fontSize: 14 }}
          >
            {dayjs(date_created).format("DD-MM-YYYY")}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Label
            variant="soft"
            color={(duration && "info") || "default"}
            sx={{ fontSize: 14 }}
          >
            {duration} Tuần
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Label
            variant="soft"
            color={(total_sessions && "info") || "default"}
            sx={{ fontSize: 14 }}
          >
            {total_sessions}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Label
            variant="soft"
            color={(start_date && "success") || "default"}
            sx={{ fontSize: 14 }}
          >
            {dayjs(start_date).format("DD-MM-YYYY")}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Label
            variant="soft"
            color={(end_date && "warning") || "default"}
            sx={{ fontSize: 14, fontWWight: "medium" }}
          >
            {dayjs(end_date).format("DD-MM-YYYY")}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
          {user && (
            <Tooltip title="Xoá" placement="top" arrow sx={{ ml: 1 }}>
              <IconButton
                sx={{ color: "error.main" }}
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
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xoá"
        content={`Bạn chắc chắn muốn xoá biên lai "${user?.first_name} ${user?.last_name}" ?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(id);
            }}
          >
            Xoá
          </Button>
        }
      />

      {user && (
        <ReceiptEditFormView
          dataReceipt={row}
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
          user={user}
        />
      )}
    </>
  );
}
