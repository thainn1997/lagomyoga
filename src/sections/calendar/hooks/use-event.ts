import { ICalendarRange, ICalendarEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

export default function useEvent(
  events: ICalendarEvent[],
  selectEventId: string,
  selectedRange: ICalendarRange,
  openForm: boolean
) {
  const currentEvent = events.find((event) => event.id === selectEventId);

  // if (!openForm) {
  //   return undefined;
  // }

  return currentEvent;
}
