import useSWR from 'swr';
import { Ref, useState, forwardRef, useCallback, ReactElement } from 'react';

import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { TransitionProps } from '@mui/material/transitions';
import { Box, alpha, Divider, useTheme, IconButton, Typography } from '@mui/material';

import { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SplashScreen from 'src/components/loading-screen/splash-screen';

import NotFoundView from 'src/sections/error/not-found-view';

import { IClassProps, IClassTableFilterValue } from 'src/types/class';
import { IStudentUser, IStudentTableFilters } from 'src/types/student';

import ClassDetailAddStudentCard from './class-detail-add-student-card';
import ClassDetailSrearchToolbarAddStudent from './class-detail-search-toolbar-student-add';

type IProps = {
  dataClass: IClassProps;
  open: boolean;
  onClose: VoidFunction;
};

const ROLE_ADMIN = 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad';
const ROLE_TEACHER = 'abd577a9-620f-4b26-8045-1b46485f501f';

const defaultFilters: IStudentTableFilters = {
  first_name: '',
  last_name: '',
  status: 'Published',
};

// ----------------------------------------------------------------------

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any>;
    },
    ref: Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

//-------------------------------------------------------------------------

export default function ClassDetailListAddStudent({ open, onClose, dataClass }: IProps) {
  const theme = useTheme();

  const [messSuccess, setMessSuccess] = useState('');

  const [filters, setFilters] = useState(defaultFilters);

  const { data, error, isLoading: loadingUser } = useSWR<IStudentUser[]>('/users', fetcher);

  const { id, day } = dataClass;

  const userFilterRole = (data || []).filter(
    (user) => user?.role !== ROLE_ADMIN && user?.role !== ROLE_TEACHER
  );

  const userNotNull = dataClass.students.filter((user) => user.directus_users_id !== null);

  const userFilterRoleWithdataClass = userFilterRole.filter(
    (user) => !userNotNull.find((item) => item.directus_users_id.id === user.id)
  );

  const dataFiltered = applyFilter({
    inputData: userFilterRoleWithdataClass,
    filters,
  });

  const handleFilters = useCallback((name: string, value: IClassTableFilterValue) => {
    setFilters((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  if (error) return <NotFoundView />;
  if (loadingUser) return <SplashScreen />;
  return (
    <Dialog
      open={open}
      fullWidth
      TransitionComponent={Transition}
      maxWidth={false}
      PaperProps={{
        sx: { maxWidth: 920, height: 470 },
      }}
    >
      <DialogActions sx={{ position: 'relative' }}>
        <IconButton
          title="Đóng"
          onClick={() => {
            onClose();
            handleFilters('last_name', '');
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
        <Typography
          variant="subtitle2"
          textTransform="uppercase"
          textAlign="center"
          sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
        >
          Học viên chưa tham gia lớp học
        </Typography>
      </DialogActions>

      <Divider />

      <ClassDetailSrearchToolbarAddStudent filters={filters} onFilters={handleFilters} />

      {messSuccess && (
        <Box textAlign="center">
          <Typography
            variant="caption"
            sx={{
              color: '#fff',
              borderRadius: 100,
              bgcolor: alpha(theme.palette.grey[600], 1),
              py: 0.3,
              px: 1,
            }}
          >
            {messSuccess}
          </Typography>
        </Box>
      )}

      <Scrollbar>
        <Box
          my={2}
          px={{ xs: 1, sm: 2 }}
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          {dataFiltered.map((item: any) => (
            <ClassDetailAddStudentCard
              key={item.id}
              item={item}
              idClass={id}
              day={day}
              setMessSuccess={setMessSuccess}
              onFilters={handleFilters}
            />
          ))}
        </Box>
      </Scrollbar>
    </Dialog>
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
