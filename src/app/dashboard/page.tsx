import AttendancePage from 'src/sections/overview/attendance/view/overview-attendance-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Điểm danh',
};

export default function Page() {
  return <AttendancePage />;
}
export const revalidate = 500;
