import dayjs from 'dayjs';
import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IClassTableFilterValue } from 'src/types/class';
import { IReceipt, ReciptProps, IReceiptTableFilters } from 'src/types/receipt';

import ReceiptTableRow from './receipt-table-row';
import ReceiptTableFiltersResult from './receipt-table-filter-result';
import ReceiptTableSearchToolbar from './receipt-table-search-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'last_name', label: 'Tên' },
  { id: 'amount_received', label: 'Học phí', width: 140 },
  { id: 'date_created', label: 'Ngày nộp', width: 140 },
  { id: 'duration', label: 'Tuần', width: 100 },
  { id: 'total_sessions', label: 'Buổi', width: 80 },
  { id: 'start_date', label: 'Bắt đầu', width: 140 },
  { id: 'end_date', label: 'Kết thúc', width: 140 },
  { id: '', label: '', width: 50 },
];

const defaultFilters: IReceiptTableFilters = {
  date_created: '',
  student: '',
  start_date: '',
};

type IProps = {
  receipt: IReceipt[];
};

// ----------------------------------------------------------------------

export default function ReceiptListView({ receipt }: IProps) {
  const receiptNotNull = receipt.filter((item) => item.student !== null);

  const table = useTable();
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: receiptNotNull,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const denseHeight = table.dense ? 52 : 72;

  const notFound = (!receiptNotNull.length && canReset) || !receiptNotNull.length;

  const handleFilters = useCallback(
    (name: string, value: IClassTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Card>
      <ReceiptTableSearchToolbar filters={filters} onFilters={handleFilters} />

      {canReset && (
        <ReceiptTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={receiptNotNull.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <ReceiptTableRow key={row.id} row={row as IReceipt} index={index} />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, receiptNotNull.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: ReciptProps[];
  comparator: (a: any, b: any) => number;
  filters: IReceiptTableFilters;
}) {
  const { date_created, start_date } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (date_created) {
    inputData = inputData.filter(
      (user) =>
        dayjs(user.date_created)
          .format('DD-MM-YYYY')
          .toLowerCase()
          .indexOf(date_created.toLowerCase()) !== -1
    );
  }

  if (start_date) {
    inputData = inputData.filter((user) => user.date_created.indexOf(start_date) !== -1);
  }

  return inputData;
}
