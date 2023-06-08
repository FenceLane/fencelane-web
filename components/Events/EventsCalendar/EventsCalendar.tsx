import React, { useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import styles from "./EventsCalendar.module.scss";
import { EventInfo } from "../../../lib/types";
import { EventAddModal } from "../EventAddModal/EventAddModal";
import moment from "moment";
import "moment/locale/pl";
import { useContent } from "../../../lib/hooks/useContent";
import { EventDetailsModal } from "../EventDetailsModal/EventDetailsModal";
import { useRouter } from "next/router";

const localizer = momentLocalizer(moment);
interface EventsCalendarProps {
  events: EventInfo[];
}

export const EventsCalendar = ({ events }: EventsCalendarProps) => {
  const [initialDates, setInitialDates] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const router = useRouter();

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);

  const { t } = useContent("pages.schedule.calendar.messages");

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setInitialDates({ start, end });
    setIsAddEventModalOpen(true);
  };

  const handleEventAddModalClose = () => {
    setInitialDates({ start: null, end: null });
    setIsAddEventModalOpen(false);
  };

  const handleEventDetailsModalClose = () => {
    const { event: _, ...prevQuery } = router.query;
    const newQuery = Object.assign(prevQuery, {});
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSelectEvent = (event: EventInfo) => {
    const eventId = event.id;
    const { event: _, ...prevQuery } = router.query;
    const newQuery = Object.assign(
      prevQuery,
      eventId ? { event: eventId } : {}
    );
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const seletedEvent =
    typeof router.query.event === "string" &&
    events.find((event) => event.id === router.query.event);

  console.log(seletedEvent);

  return (
    <div className={styles.wrapper}>
      <EventAddModal
        key={initialDates.start?.toString()}
        initialDates={initialDates}
        isOpen={isAddEventModalOpen}
        onClose={handleEventAddModalClose}
      />
      {seletedEvent && (
        <EventDetailsModal
          key={seletedEvent.id}
          onClose={handleEventDetailsModalClose}
          eventData={seletedEvent}
        />
      )}
      <Calendar
        localizer={localizer}
        defaultView={Views.MONTH}
        events={events.map(({ startDate, endDate, ...rest }) => ({
          ...rest,
          start: startDate,
          end: endDate,
        }))}
        messages={{
          week: t("week"),
          work_week: t("work_week"),
          day: t("day"),
          month: t("month"),
          previous: t("previous"),
          next: t("next"),
          today: t("today"),
          agenda: t("agenda"),
        }}
        views={["day", "week", "month"]}
        onSelectEvent={({ start, end, ...event }) =>
          handleSelectEvent({
            ...event,
            startDate: start,
            endDate: end,
          })
        }
        onSelectSlot={handleSelectSlot}
        selectable
        defaultDate={new Date(Date.now())}
        scrollToTime={new Date(Date.now())}
      />
    </div>
  );
};
