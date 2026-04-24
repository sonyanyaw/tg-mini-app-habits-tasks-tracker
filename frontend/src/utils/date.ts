export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMonday = (date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
};

export const formatDisplayDate = (
  selectedDate: Date,
  todayDate: Date = new Date(),
): string => {
  const isToday = formatDate(selectedDate) === formatDate(todayDate);
  const isTomorrow =
    todayDate.getMonth() === selectedDate.getMonth() &&
    todayDate.getFullYear() === selectedDate.getFullYear() &&
    selectedDate.getDate() - todayDate.getDate() === 1;
  const isYesterday =
    todayDate.getMonth() === selectedDate.getMonth() &&
    todayDate.getFullYear() === selectedDate.getFullYear() &&
    todayDate.getDate() - selectedDate.getDate() === 1;

  if (isToday) return "today";
  if (isTomorrow) return "tomorrow";
  if (isYesterday) return "yesterday";
  return formatDate(selectedDate);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const generateWeekDays = (referenceDate: Date = new Date()) => {
  const days: { weekday: number; monthday: number; date: Date }[] = [];
  const monday = new Date(referenceDate);
  const day = referenceDate.getDay();
  const diff = referenceDate.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    days.push({
      weekday: currentDay.getDay(),
      monthday: currentDay.getDate(),
      date: new Date(currentDay),
    });
  }
  return days;
};

export const addDays = (date: Date, amount: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
};

export const isCurrentWeek = (currentWeekStart: Date) =>
  isSameDate(getMonday(new Date()), currentWeekStart);

export const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameWeek = (a: Date, b: Date) =>
  isSameDate(getMonday(a), getMonday(b));

export const formatMonthYearRange = (weekDays: { date: Date }[]) => {
  const first = weekDays[0].date;
  const last = weekDays[6].date;

  const firstMonth = first.toLocaleDateString("en-US", { month: "long" });
  const lastMonth = last.toLocaleDateString("en-US", { month: "long" });

  const year = first.getFullYear();

  if (first.getMonth() !== last.getMonth()) {
    return `${capitalize(firstMonth)} - ${capitalize(lastMonth)} ${year}`;
  }

  return `${capitalize(firstMonth)} ${year}`;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
