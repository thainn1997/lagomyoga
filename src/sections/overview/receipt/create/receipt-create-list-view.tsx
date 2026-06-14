'use client';

import React, { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, IconButton, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import { IClassTableFilterValue } from 'src/types/class';
import { ReciptProps, IStudentWithReceipt } from 'src/types/receipt';
import { IStudentUser, IStudentTableFilters } from 'src/types/student';

import ReceiptCreateCardView from './receipt-create-form-view';
import ReceiptCreateSrearchToolbar from './receipt-create-search-toolbar';

type IProps = {
  currentUser: IStudentUser[];
  receipt: ReciptProps[];
};

const ROLE_ADMIN = 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad';

const defaultFilters: IStudentTableFilters = {
  first_name: '',
  last_name: '',
  status: 'Published',
};

//------------------------------------------------------

export default function ReceiptCreateListView({ currentUser, receipt: dataReceipt }: IProps) {
  const currentUserFilter = currentUser.filter((user) => user?.role !== ROLE_ADMIN);

  const currentUserFilterWithreceipt = currentUserFilter.map((user) => {
    const receipt = dataReceipt.filter((item) => item.student === user.id);
    return { ...user, receipt };
  });

  const currentUserFilterWithreceipts = currentUserFilterWithreceipt.filter(
    (item) => item.id !== null && item.last_name !== null && item.first_name !== null
  );

  return <ReceiptCreateListCardView data={currentUserFilterWithreceipts} />;
}

//----------------------------------------------------------------------------------------------------
function ReceiptCreateListCardView({ data }: any) {
  const theme = useTheme();

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: data,
    filters,
  });

  const handleFilters = useCallback((name: string, value: IClassTableFilterValue) => {
    setFilters((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  return (
    <Card
      sx={{
        p: 2,
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.9 : 0.2
          ),
          imgUrl: '/assets/background/overlay_3.jpg',
        }),
      }}
    >
      <ReceiptCreateSrearchToolbar filters={filters} onFilters={handleFilters} />

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
      >
        {dataFiltered.map((user: any) => (
          <ReceiptCardView user={user} key={user.id} />
        ))}
      </Box>
    </Card>
  );
}

//--------------------------------------------------------------------------------------------
function ReceiptCardView({ user }: any) {
  const active = useBoolean();

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: (t) => t.spacing(3, 2, 3, 3),
        }}
      >
        <Avatar alt={user.last_name} sx={{ width: 48, height: 48, mr: 2 }}>
          {user.last_name[0].toLocaleUpperCase()}
        </Avatar>
        <ListItemText
          primary={`${user.first_name} ${user.last_name}`}
          secondary={
            <>
              <Iconify
                icon="noto:closed-mailbox-with-raised-flag"
                width={16}
                sx={{ flexShrink: 0, mr: 0.5 }}
              />
              {user.email}
            </>
          }
          primaryTypographyProps={{
            noWrap: true,
            typography: 'subtitle2',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            noWrap: true,
            component: 'span',
            variant: 'caption',
            color: 'text.secondary',
          }}
        />

        <IconButton
          color="info"
          onClick={() => {
            active.onTrue();
          }}
          sx={{ flexShrink: 0, ml: 1.5 }}
        >
          <Iconify icon="system-uicons:write" />
        </IconButton>
      </Card>
      <ReceiptCreateCardView
        currentUser={user}
        open={active.value}
        onClose={active.onFalse}
        id={user.id}
      />
      {(user.receipt || []).map(
        (item: any) =>
          item && (
            <ReceiptForm
              key={item.id}
              currentUser={user}
              open={active.value}
              onClose={active.onFalse}
              id={user.id}
              idReceipt={item.id}
              item={item}
            />
          )
      )}
    </>
  );
}

//----------------------------------------------
type Props = {
  open: boolean;
  onClose: VoidFunction;
  id: string;
  currentUser: IStudentWithReceipt;
  idReceipt?: string;
  item: any;
};
function ReceiptForm({ currentUser, open, onClose, id, idReceipt, item }: Props) {
  return (
    <ReceiptCreateCardView
      currentUser={currentUser}
      open={open}
      onClose={onClose}
      id={id}
      idReceipt={idReceipt}
    />
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }: { inputData: any; filters: IStudentTableFilters }) {
  const { first_name, status, last_name } = filters;

  const stabilizedThis = inputData.map((el: any, index: number) => [el, index] as const);

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (first_name) {
    inputData = inputData.filter(
      (user: any) => user.first_name.toLowerCase().indexOf(first_name.toLowerCase()) !== -1
    );
  }

  if (last_name) {
    inputData = inputData.filter(
      (user: any) => user.last_name.toLowerCase().indexOf(last_name.toLowerCase()) !== -1
    );
  }

  if (status !== 'Published') {
    inputData = inputData.filter((user: any) => user.status === status);
  }

  return inputData;
}
