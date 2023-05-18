import React, { useState } from "react";
import { Calendar, Views, Event, momentLocalizer } from "react-big-calendar";
import styles from "./EventsCalendar.module.scss";
import { EventInfo } from "../../../lib/types";
import { EventAddModal } from "../EventAddModal/EventAddModal";
import moment from "moment";
import "moment/locale/pl";

const localizer = momentLocalizer(moment);
interface EventsCalendarProps {
  events: EventInfo[];
}

export const EventsCalendar = ({ events }: EventsCalendarProps) => {
  const [initialDates, setInitialDates] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setInitialDates({ start, end });
    setIsAddEventModalOpen(true);
  };

  const handleEventAddModalClose = () => {
    setInitialDates({ start: null, end: null });
    setIsAddEventModalOpen(false);
  };

  const handleSelectEvent = (event: Event) => console.log(event);

  return (
    <div className={styles.wrapper}>
      <EventAddModal
        key={initialDates.start?.toString()}
        initialDates={initialDates}
        isOpen={isAddEventModalOpen}
        onClose={handleEventAddModalClose}
      />
      <Calendar
        localizer={localizer}
        defaultView={Views.MONTH}
        events={events.map(({ startDate, endDate, title, ...rest }) => ({
          start: new Date(startDate),
          end: new Date(endDate),
          title,
          ...rest,
        }))}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        defaultDate={new Date(Date.now())}
        scrollToTime={new Date(Date.now())}
      />
    </div>
  );
};
