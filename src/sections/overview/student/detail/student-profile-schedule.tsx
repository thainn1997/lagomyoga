import { CalendarView } from 'src/sections/calendar/view';

import { Schedule } from 'src/types/receipt';
import { IClassProps } from 'src/types/class';

// ----------------------------------------------------------------------

type IProps = {
  currentClass: IClassProps[];
  loading: boolean;
  currentSchedule: Schedule[];
};

export default function StudentProfileSchedule({ currentClass, loading, currentSchedule }: IProps) {
  const resultArray: { classId: string; date: string; dayOfWeek: string; useId: string }[] = [];

  currentSchedule.forEach((item) => {
    item.data.forEach((entry) => {
      resultArray.push({
        classId: item.classId,
        date: entry.date,
        dayOfWeek: entry.dayOfWeek,
        useId: item.userId,
      });
    });
  });

  const schedule = resultArray.map((item) => {
    const cls = (currentClass || []).find((x) => x.id === item.classId);
    return { ...item, cls };
  });

  return <CalendarView loading={loading} schedule={schedule} />;
}
