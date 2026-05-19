import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

export function StreakCalendar({
  activeDates,
  month = new Date(),
}: {
  activeDates: Date[];
  month?: Date;
}) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const activeSet = activeDates.map((d) => format(d, "yyyy-MM-dd"));

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gray-800">{format(month, "MMMM yyyy")}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <span key={d} className="py-1 font-medium text-gray-400">{d}</span>
        ))}
        {Array.from({ length: start.getDay() }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const active = activeSet.includes(key);
          const today = isSameDay(day, new Date());
          return (
            <span
              key={key}
              className={`flex h-8 items-center justify-center rounded-lg ${
                active
                  ? "bg-[#4DA6FF] font-semibold text-white"
                  : today
                    ? "ring-1 ring-[#4DA6FF]/50 text-gray-700"
                    : "text-gray-500"
              }`}
            >
              {format(day, "d")}
            </span>
          );
        })}
      </div>
    </div>
  );
}
