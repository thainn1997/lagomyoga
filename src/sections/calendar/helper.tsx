import dayjs from 'dayjs';

interface IClassStudent {
  directus_users_id: string;
  class: string;
  day_studies: string;
}
interface IClass {
  id: string;
  students: IClassStudent[];
  time_shift: string;
  day: string[];
}

interface IDayInSchedule {
  value: number;
  class: IClass;
}

const getDateByClass = (cls: IClass[] = [], studentId: string = '') => {
  let days_study: IDayInSchedule[] = [];
  cls.forEach((cl) => {
    const record = cl.students.find((st) => st.directus_users_id === studentId);
    const day: IDayInSchedule[] = (record?.day_studies?.split('-') || cl.day).map((d) => ({
      class: cl,
      value: d === 'CN' ? 1 : parseInt(d, 10),
    }));
    days_study = [...days_study, ...day];
  });
  return days_study;
};
const createSchedule = (date: Date, currentClass: any, studentId: string) => {
  const daysStudy = getDateByClass(currentClass, studentId);
  const fisrtDate = dayjs(date);
  const schedule = [];
  for (let i = 1; i < 40; i += 1) {
    const dateEvent = fisrtDate.date(i);
    const dayInWeed = dateEvent.day() + 1;

    const valid = daysStudy.find((data: IDayInSchedule) => data.value === dayInWeed);
    if (valid)
      schedule.push({
        day: dateEvent,
        class: valid.class,
      });
  }
  return schedule;
};

export default { createSchedule };
