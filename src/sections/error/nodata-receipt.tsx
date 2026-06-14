'use client';

import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import CompactLayout from 'src/layouts/compact';
import { MotivationIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function NoDataReceipt() {
  return (
    <CompactLayout>
      <MotionContainer sx={{ padding: 0 }}>
        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Xin lỗi hiện tại chưa có thông báo nào!
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

        <Button component={RouterLink} href="/" size="large" variant="contained">
          Quay Về Trang Chủ
        </Button>
      </MotionContainer>
    </CompactLayout>
  );
}
