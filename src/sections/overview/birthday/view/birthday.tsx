'use client';

import useSWR from 'swr';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import { Container } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Card,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  ListItemText,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { SplashScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';

import { NotFoundView } from 'src/sections/error';

import { StudentProps } from 'src/types/receipt';

type ISelectBirthDay = {
  setListData: any;
};

type IListDataBirthDay = {
  listBirthDay: StudentProps[];
};

function FilterBirthDay({ setListData }: ISelectBirthDay) {
  const [month, setMonth] = useState<dayjs.Dayjs | null>(dayjs());

  const filter = {
    _and: [
      { 'month(birthday)': { _eq: `${dayjs(month).month() + 1}` } },
      { role: { _eq: 'b49dda8a-60a9-44b5-9d88-9b0db3480741' } },
    ],
  };
  const { data, error, isLoading } = useSWR(`/users?filter=${JSON.stringify(filter)}`, fetcher);

  useEffect(() => {
    setListData(data);
  }, [setListData, data]);

  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  return (
    <DatePicker
      sx={{ maxWidth: 200, mb: 3 }}
      views={['month']}
      label="Tháng"
      value={dayjs(month)}
      onChange={(newValue) => {
        setMonth(newValue);
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          margin: 'normal',
        },
      }}
    />
  );
}

const TABLE_HEAD = [
  { id: 'index', label: 'No.', width: 80 },
  { id: 'name', label: 'Họ và tên' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'birthday', label: 'Sinh nhật' },
];

function TableDataBirthDay({ listBirthDay }: IListDataBirthDay) {
  const table = useTable();

  const denseHeight = table.dense ? 52 : 72;
  return (
    <Card sx={{ shadow: 'none' }}>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={listBirthDay?.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />
            <TableBody>
              {listBirthDay
                ?.slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row: any, index: any) => (
                  <BirthDayTableRow key={row.id} row={row} index={index} />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, listBirthDay?.length)}
              />

              <TableNoData notFound={listBirthDay?.length === 0} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

function BirthDayTableRow({ row, index }: { row: any; index: number }) {
  const { first_name, last_name, email, birthday, phone } = row;

  return (
    <TableRow hover component="tr">
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color={(index + 1 && 'info') || 'default'} sx={{ fontSize: 14 }}>
          {index + 1}
        </Label>
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={last_name[0]} sx={{ mr: 2 }}>
          {last_name[0].toLocaleUpperCase()}
        </Avatar>
        <div>
          <ListItemText
            primary={
              <strong>
                {` ${first_name}
                  ${last_name}`}
              </strong>
            }
            primaryTypographyProps={{
              typography: 'body2',
              whiteSpace: 'nowrap',
            }}
          />
          <Typography variant="body2">{email}</Typography>
        </div>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color="default" sx={{ fontSize: 14 }}>
          {phone}
        </Label>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={(birthday && 'warning') || 'default'}
          sx={{ fontSize: 14, fontWWight: 'medium' }}
        >
          {dayjs(birthday).format('DD-MM-YYYY')}
        </Label>
      </TableCell>
    </TableRow>
  );
}

export default function OverviewBirthday() {
  const settings = useSettingsContext();
  const [listData, setListData] = useState([]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Sinh nhật học viên"
        links={[{ name: 'Trang chủ', href: paths.dashboard.root }, { name: 'Sinh nhật học viên' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FilterBirthDay setListData={setListData} />
      <TableDataBirthDay listBirthDay={listData} />
    </Container>
  );
}
