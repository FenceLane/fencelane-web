import { EventInfo } from "../../../lib/types";
import { EventsCalendar } from "../EventsCalendar/EventsCalendar";

interface EventsProps {
  events: EventInfo[];
}

export const Events = ({ events }: EventsProps) => {
  return <EventsCalendar events={events} />;
};
