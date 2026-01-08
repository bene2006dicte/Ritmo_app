import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isToday, isAfter, isBefore } from "date-fns";
import { fr } from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ProgressCalendar.css";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface ProgressData {
  id: number;
  date: string;
  completed: boolean;
}

interface Props {
  objectiveId: number | null;
  progressData: ProgressData[];
  onSelectDate: (date: Date) => void;
  startDate?: string; // date de début de l'objectif
}

export default function ProgressCalendar({
  objectiveId,
  progressData,
  onSelectDate,
  startDate,
}: Props) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!objectiveId) return;

    // Transformer progressData en événements pour le calendrier
    const formatted = progressData.map((p) => ({
      id: p.id,
      title: "",
      start: new Date(p.date),
      end: new Date(p.date),
      completed: p.completed,
    }));

    setEvents(formatted);
  }, [progressData, objectiveId]);

  const dayClassGetter = (date: Date) => {
    const today = new Date();

    // Avant le début de l'objectif → blanc
    if (startDate && isBefore(date, new Date(startDate))) return "day-before-start";

    // Aujourd'hui
    if (isToday(date)) return "day-today";

    // Jours à venir après aujourd'hui → gris clair
    if (isAfter(date, today)) return "day-future";

    // Vérifier si ce jour est complété
    const event = events.find(
      (e) => e.start.toDateString() === date.toDateString()
    );
    if (event && event.completed) return "day-success";

    // Jour passé non complété → rouge
    return "day-failed";
  };

  const eventStyleGetter = (event: any) => ({
    className: event.completed ? "day-success" : "day-failed",
  });

  return (
    <div className="calendar-wrapper">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        selectable
        onSelectSlot={(slotInfo: any) => onSelectDate(slotInfo.start)}
        dayPropGetter={(date) => ({ className: dayClassGetter(date) })}
        eventPropGetter={eventStyleGetter}
        style={{ height: 520 }}
      />
    </div>
  );
}
