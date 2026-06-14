'use client';

import { m } from 'framer-motion';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SeverErrorIllustration } from 'src/assets/illustrations';

import { varZoom, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function NoDataAttendanceView() {
  return (
    <Box>
      <MotionContainer>
        <m.div variants={varZoom({ easeIn: 'easeInOut', distance: 100 }).inUp}>
          <Typography variant="h3" sx={{ mb: 2, textAlign: 'center' }}>
            Hiện tại chưa có lớp học nào <br /> đang diễn ra!
          </Typography>
        </m.div>

        <m.div variants={varZoom({ easeIn: 'easeInOut', distance: 50 }).inUp}>
          {/* <Typography sx={{ color: 'text.secondary' }}>
            Xin lỗi, không thể tìm thấy lớp học đang diễn ra. Hãy kiểm tra lại các lớp học chuẩn bị
            diễn ra ngay bây giờ!
          </Typography> */}
        </m.div>

        <m.div variants={varZoom({ easeIn: 'easeInOut', distance: 50 }).inUp}>
          <SeverErrorIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Box sx={{ textAlign: 'center' }}>
          <Button component={RouterLink} href="/dashboard/class" size="large" variant="contained">
            Đến Lớp Học
          </Button>
        </Box>
      </MotionContainer>
    </Box>
  );
}
