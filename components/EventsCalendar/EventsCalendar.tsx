import React, { useState } from "react";
import { Calendar, Views, Event, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import styles from "./EventsCalendar.module.scss";

const localizer = dayjsLocalizer(dayjs);

export const EventsCalendar = () => {
  const [myEvents, setEvents] = useState<Event[]>([]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt("New Event name");
    if (title) {
      setEvents((prev) => [...prev, { start, end, title }]);
    }
  };

  const handleSelectEvent = (event: Event) => window.alert(event.title);

  return (
    <div className={styles.wrapper}>
      <Calendar
        localizer={localizer}
        defaultView={Views.MONTH}
        events={myEvents}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        defaultDate={new Date(Date.now())}
        scrollToTime={new Date(Date.now())}
      />
    </div>
  );
};
