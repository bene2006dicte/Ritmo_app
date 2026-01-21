import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isAfter,
  isBefore,
  parseISO,
  isSameDay,
} from "date-fns";
import { fr } from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ProgressCalendar.css";
import { useEffect, useState } from "react";

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

const toLocalDateOnly = (input: string | Date) => {
  const d = typeof input === "string" ? parseISO(input) : input;
  const local = new Date(d);
  local.setHours(0, 0, 0, 0);
  return local;
};

export default function ProgressCalendar({
  objectiveId,
  progressData,
  onSelectDate,
  startDate,
}: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // état contrôlé

  useEffect(() => {
    if (!objectiveId) return;

    // Déduplication : un seul événement par jour
    const byDay = new Map<string, { start: Date; end: Date; completed: boolean }>();

    progressData.forEach((p) => {
      const day = toLocalDateOnly(p.date);
      const key = day.toDateString();
      const existing = byDay.get(key);
      const completed = p.completed || existing?.completed || false;
      byDay.set(key, { start: day, end: day, completed });
    });

    const formatted = Array.from(byDay.values()).map((e) => ({
      title: "",
      start: e.start,
      end: e.end,
      completed: e.completed,
    }));

    setEvents(formatted);
  }, [progressData, objectiveId]);

  const dayClassGetter = (date: Date) => {
    const d = toLocalDateOnly(date);
    const today = toLocalDateOnly(new Date());

    if (startDate && isBefore(d, toLocalDateOnly(startDate))) return "day-before-start";

    const event = events.find((e) => isSameDay(e.start, d));
    const isCompleted = !!event?.completed;

    if (isSameDay(d, today)) {
      return isCompleted ? "day-success" : "day-today";
    }

    if (isAfter(d, today)) return "day-future";
    return isCompleted ? "day-success" : "day-failed";
  };

  const canSelectDate = (date: Date) => {
    const d = toLocalDateOnly(date);
    const today = toLocalDateOnly(new Date());
    if (startDate && isBefore(d, toLocalDateOnly(startDate))) return false;
    if (isAfter(d, today)) return false;
    return true;
  };

  const handleSelectSlot = (slotInfo: any) => {
    const selected = toLocalDateOnly(slotInfo.start);
    if (!canSelectDate(selected)) return;
    onSelectDate(selected);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="calendar-wrapper">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        defaultView="month"
        date={currentDate}              // calendrier contrôlé
        onNavigate={handleNavigate}     // navigation explicite
        selectable
        onSelectSlot={handleSelectSlot}
        dayPropGetter={(date) => ({ className: dayClassGetter(date) })}
        eventPropGetter={(event: any) => ({
          className: event.completed ? "day-success" : "day-failed",
        })}
        components={{ event: () => null }}
        popup={false}
        style={{ height: 520 }}
      />
    </div>
  );
}
