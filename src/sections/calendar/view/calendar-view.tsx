'use client';

import Calendar from '@fullcalendar/react'; // => request placed at the top
import dayjs from 'dayjs';
import { useEffect } from 'react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { ICalendarEvent } from 'src/types/calendar';

import { StyledCalendar } from '../styles';
import useCalendar from '../hooks/use-calendar';
import CalendarToolbar from '../calendar-toolbar';

// ----------------------------------------------------------------------

// const defaultFilters: ICalendarFilters = {
//   colors: [],
//   startDate: null,
//   endDate: null,
// };

type IProps = {
  schedule?: any;
  loading: boolean;
};

// ----------------------------------------------------------------------

export default function CalendarView({ schedule, loading }: IProps) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const smUp = useResponsive('up', 'sm');

  const openFilters = useBoolean();

  const {
    calendarRef,
    //
    view,
    date,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    // onDropEvent,
    onChangeView,
    onSelectRange,
    // onClickEvent,
    // onResizeEvent,
    onInitialView,
    //
    // openForm,
    // onOpenForm,
    // onCloseForm,
    //
    // selectEventId,
    // selectedRange,
    //
    // onClickEventInFilters,
  } = useCalendar();

  useEffect(() => {
    onInitialView();
    openFilters.onTrue();
  }, [onInitialView, openFilters]);

  const day = dayjs().format('YYYY-MM-DD');

  const events: ICalendarEvent[] = (schedule || []).map((item: any, index: number) => ({
    id: `${index + dayjs(item?.date, 'DD-MM-YYYY').format('YYYY-MM-DD')}a`,
    class: item?.cls,
    title:
      day > dayjs(item?.date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        ? `${item?.cls?.title} | Đã qua`
        : item.cls?.title,
    date: dayjs(item?.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    color:
      day > dayjs(item?.date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        ? theme.palette.primary.main
        : theme.palette.info.main,
    description: 'more info mation',
    textColor:
      day > dayjs(item.date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        ? theme.palette.warning.main
        : theme.palette.info.main,
    start: `${dayjs(item?.date, 'DD-MM-YYYY').format('YYYY-MM-DD')} ${item?.cls?.time_shift.start_time}`,
    end: `${dayjs(item?.date, 'DD-MM-YYYY').format('YYYY-MM-DD')} ${item?.cls?.time_shift.end_time}`,
  }));

  const dataFiltered = applyFilter({
    inputData: events,
  });

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <StyledCalendar sx={{ mb: 2 }}>
          <CalendarToolbar
            date={date}
            view={view}
            loading={loading}
            onNextDate={onDateNext}
            onPrevDate={onDatePrev}
            onToday={onDateToday}
            onChangeView={onChangeView}
            onOpenFilters={openFilters.onTrue}
          />

          <Calendar
            weekends
            editable
            droppable
            selectable
            rerenderDelay={10}
            allDayMaintainDuration
            eventResizableFromStart
            ref={calendarRef}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            events={dataFiltered}
            headerToolbar={false}
            select={onSelectRange}
            noEventsContent={<EmptyContent title="Trống" />}
            // eventClick={onClickEvent}

            height={smUp ? 720 : 'auto'}
            // eventDrop={(arg) => {
            //   onDropEvent(arg, updateEvent);
            // }}
            // eventResize={(arg) => {
            //   onResizeEvent(arg, updateEvent);
            // }}
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
          />
        </StyledCalendar>
      </Container>

      {/* <Dialog
        fullWidth
        maxWidth="xs"
        open={openForm}
        onClose={onCloseForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> {currentEvent?.id ? 'Edit Event' : 'Add Event'}</>}
        </DialogTitle>

        <CalendarForm
          currentEvent={currentEvent}
          colorOptions={CALENDAR_COLOR_OPTIONS}
          onClose={onCloseForm}
        />
      </Dialog> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData }: { inputData: ICalendarEvent[] }) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
