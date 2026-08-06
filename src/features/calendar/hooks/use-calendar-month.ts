'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getCalendarAction } from '@/features/calendar/actions/get-calendar';
import { shiftMonth } from '@/features/calendar/lib/calendar-display';
import type {
  CalendarCategory,
  CalendarEvent,
  CalendarImpact,
  CalendarMonthData,
  GetCalendarInput,
} from '@/features/calendar/types';

export function useCalendarMonth(
  initialData: CalendarMonthData,
  initialUpcoming: CalendarEvent[],
) {
  const [month, setMonth] = useState(initialData.month);
  const [impact, setImpact] = useState<'all' | CalendarImpact>('all');
  const [category, setCategory] = useState<'all' | CalendarCategory>('all');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [data, setData] = useState(initialData);
  const [upcoming] = useState(initialUpcoming);

  useEffect(() => {
    let active = true;

    void getCalendarAction({
      month,
      impact: impact === 'all' ? undefined : impact,
      category: category === 'all' ? undefined : category,
    } satisfies GetCalendarInput).then((result) => {
      if (!active) return;

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setData(result.data);
      setSelectedDay(null);
    });

    return () => {
      active = false;
    };
  }, [month, impact, category]);

  function goPrevMonth() {
    setMonth((current) => shiftMonth(current, -1));
  }

  function goNextMonth() {
    setMonth((current) => shiftMonth(current, 1));
  }

  const events =
    selectedDay == null
      ? upcoming
      : data.items.filter((event) => event.day === selectedDay);

  return {
    month,
    data,
    impact,
    setImpact,
    category,
    setCategory,
    selectedDay,
    setSelectedDay,
    goPrevMonth,
    goNextMonth,
    events,
  };
}
