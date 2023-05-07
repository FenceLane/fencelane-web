import React from "react";
import { Calendar, Views, Event, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import styles from "./EventsCalendar.module.scss";
import { EventInfo } from "../../../lib/types";

const localizer = dayjsLocalizer(dayjs);

interface EventsCalendarProps {
  events: EventInfo[];
}

export const EventsCalendar = ({ events }: EventsCalendarProps) => {
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt("New Event name");
    if (title) {
      console.log("patryk add event ", { start, end, title });
    }
  };

  const handleSelectEvent = (event: Event) => console.log(event);

  return (
    <div className={styles.wrapper}>
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
