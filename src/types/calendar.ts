// ----------------------------------------------------------------------

import { IClassProps } from './class';

export type ICalendarFilterValue = string[] | Date | null;

export type ICalendarFilters = {
  colors: string[];
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type ICalendarDate = string | number;

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarRange = {
  start: ICalendarDate;
  end: ICalendarDate;
  date?: ICalendarDate;
} | null;

export type ICalendarEvent = {
  id: string;
  color: string;
  title: string;
  description?: string;
  date: ICalendarDate;
  class: IClassProps;
  textColor: string;
  start: ICalendarDate;
  end: ICalendarDate;
};
