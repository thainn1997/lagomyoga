'use client';

import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import CompactLayout from 'src/layouts/compact';
import { MotivationIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function NoDataStudentView() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Xin lỗi, Hiện tại danh sách học sinh đang trống
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Hãy đi đến <strong>Tạo Học Viên</strong> ngay nào
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <MotivationIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button
          component={RouterLink}
          href="/dashboard/student/create"
          size="large"
          variant="contained"
        >
          Tạo Học Viên
        </Button>
      </MotionContainer>
    </CompactLayout>
  );
}
