import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return (
    query && (
      <Paper
        sx={{
          bgcolor: 'unset',
          textAlign: 'center',
          ...sx,
        }}
        {...other}
      >
        <Typography variant="h6" gutterBottom>
          Không tìm thấy
        </Typography>

        <Typography variant="body2">
          Không tìm thấy kết quả nào cho &nbsp;
          <strong>&quot;{query}&quot;</strong>.
          <br /> Hãy thử kiểm tra lỗi chính tả hoặc sử dụng các từ hoàn chỉnh.
        </Typography>
      </Paper>
    )
  );
}
