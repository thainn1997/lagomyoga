import { useTheme } from '@mui/system';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Card, alpha } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { renderImageById } from 'src/utils/helper';

import { bgGradient } from 'src/theme/css';

import { IStudentUser } from 'src/types/student';

type IProps = {
  profile: IStudentUser;
};

//---------------------------------------------------------

export default function StudentProfileHeadView({ profile }: IProps) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        // ...bgGradient({
        //   direction: '89deg',
        //   startColor: alpha(theme.palette.primary.main, 0.7),
        //   endColor: alpha(theme.palette.primary.main, 0.9),
        // }),
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.9 : 0.2
          ),
          imgUrl: '/assets/background/overlay_3.jpg',
        }),
        borderRadius: 0.5,
        p: 3,
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }}>
        <Avatar
          variant="rounded"
          src={renderImageById(
            profile?.avatar,
            'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg'
          )}
          alt={profile?.last_name[0]}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
          }}
        />

        <ListItemText
          sx={{
            mt: 3,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={`${profile?.first_name} ${profile?.last_name}`}
          secondary={profile?.email}
          primaryTypographyProps={{
            typography: 'div',
            fontSize: 24,
          }}
          secondaryTypographyProps={{
            noWrap: true,
            mt: 0.5,
            component: 'div',
            typography: 'body2',
          }}
        />
      </Stack>
    </Card>
  );
}
