import useSWR from 'swr';
import { m } from 'framer-motion';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
import { SplashScreen } from 'src/components/loading-screen';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { NotFoundView } from 'src/sections/error';

import { IStudentUser } from 'src/types/student';

const ROLE_ADMIN = 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad';

type IProps = {
  idLogin: any;
};

// ----------------------------------------------------------------------

export default function ContactsPopover({ idLogin }: IProps) {
  const popover = usePopover();

  const { id } = idLogin;

  const { data, error, isLoading } = useSWR<IStudentUser[]>(`/users`, fetcher);
  if (error) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  const dataFilter = data?.filter(
    (contact) =>
      contact.role !== ROLE_ADMIN &&
      contact.id !== id &&
      contact.first_name !== null &&
      contact.last_name !== null &&
      contact.email !== null
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={popover.open ? 'inherit' : 'default'}
        onClick={popover.onOpen}
        sx={{
          ...(popover.open && {
            bgcolor: (theme) => theme.palette.action.selected,
          }),
        }}
      >
        <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 320 }}>
        <Typography variant="h6" sx={{ p: 1.5 }}>
          Contacts <Typography component="span">({dataFilter?.length})</Typography>
        </Typography>

        <Scrollbar sx={{ height: 320 }}>
          {dataFilter?.map((contact) => (
            <MenuItem key={contact.id} sx={{ p: 1 }}>
              <Badge
                variant={contact.status as 'alway' | 'online' | 'busy' | 'offline'}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{ mr: 2 }}
              >
                <Avatar alt={contact.first_name}>
                  {contact?.first_name[0].toLocaleUpperCase()}
                </Avatar>
              </Badge>

              <ListItemText
                primary={`${contact.first_name} ${contact.last_name}`}
                secondary={contact.email}
                primaryTypographyProps={{ typography: 'subtitle2' }}
                secondaryTypographyProps={{
                  typography: 'caption',
                  color: 'text.disabled',
                }}
              />
            </MenuItem>
          ))}
        </Scrollbar>
      </CustomPopover>
    </>
  );
}
