import React, { useEffect, useMemo, useRef, useState } from "react";

interface DatePickerRangeProps{
    setDates: React.Dispatch<React.SetStateAction<{ startDate?: Date; endDate?: Date }>>; 
    dates: { startDate?: Date | undefined; endDate?: Date | undefined; }
}
// ===== Types =====
export type DateRange = { start?: Date; end?: Date };

interface Preset {
  label: string;
  range: () => DateRange;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (next: DateRange) => void;
  locale?: string; // e.g., "es-PA" | "en-US"
  weekStartsOn?: 0 | 1; // 0: Sunday, 1: Monday
  min?: Date;
  max?: Date;
  disabled?: (d: Date) => boolean;
  presets?: Preset[];
  numberOfMonths?: 1 | 2;
  className?: string;
  placeholder?: string;  
  setDates: React.Dispatch<React.SetStateAction<{ startDate?: Date | undefined; endDate?: Date | undefined; }>>
  dates: { startDate?: Date|undefined; endDate?: Date|undefined; }
}

// ===== Date Utils (no deps) =====
const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const ymd = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const isSameDay = (a?: Date, b?: Date) => (!!a && !!b ? ymd(a) === ymd(b) : false);
const isAfter = (a: Date, b: Date) => ymd(a) > ymd(b);
const isBefore = (a: Date, b: Date) => ymd(a) < ymd(b);
const clamp = (d: Date, min?: Date, max?: Date) => {
  const n = atMidnight(d);
  if (min && isBefore(n, min)) return atMidnight(min);
  if (max && isAfter(n, max)) return atMidnight(max);
  return n;
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return atMidnight(x);
};
const addMonths = (d: Date, n: number) => {
  const x = new Date(d.getFullYear(), d.getMonth() + n, 1);
  // If original date was 31st, we still want day 1 grid anchor, so keep at day 1
  return atMidnight(x);
};
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const inRangeInclusive = (d: Date, a?: Date, b?: Date) => {
  if (!a || !b) return false;
  const [s, e] = ymd(a) <= ymd(b) ? [a, b] : [b, a];
  const v = ymd(d);
  return ymd(s) <= v && v <= ymd(e);
};

const buildMonthMatrix = (anchorMonth: Date, weekStartsOn: 0 | 1) => {
  // Returns 42 Date objects representing the calendar grid for the month (6 rows × 7 days)
  const first = startOfMonth(anchorMonth);
  const firstWeekday = first.getDay(); // 0=Sun
  const offset = (firstWeekday - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
};

// ===== Hook: click outside =====
function useClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, onOutside: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

// ===== Subcomponent: CalendarMonth =====
interface CalendarMonthProps {
  monthAnchor: Date; // First day of a month (e.g., 2025-10-01)
  value: DateRange;
  draftStart?: Date; // start selected but end not chosen yet
  hoverDate?: Date | null;
  weekStartsOn: 0 | 1;
  locale: string;
  min?: Date;
  max?: Date;
  disabled?: (d: Date) => boolean;
  onPick: (d: Date) => void;
  onHover: (d: Date | null) => void;  
  setDates: React.Dispatch<React.SetStateAction<{ startDate?: Date; endDate?: Date }>>;
}

const dayLabel = (d: Date, locale: string) => new Intl.DateTimeFormat(locale, { day: "numeric" }).format(d);

const CalendarMonth: React.FC<CalendarMonthProps> = ({
  monthAnchor,
  value,
  draftStart,
  hoverDate,
  weekStartsOn,
  locale,
  min,
  max,
  disabled,
  onPick,
  onHover
}) => {
  const matrix = useMemo(() => buildMonthMatrix(monthAnchor, weekStartsOn), [monthAnchor, weekStartsOn]);
  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(monthAnchor);
  const dowBase = weekStartsOn === 1 ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
  const weekdayNames = dowBase.map((d) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2023, 0, 1 + d))
  );  
  const start = value.start ? atMidnight(value.start) : undefined;
  const end = value.end ? atMidnight(value.end) : undefined;

  return (
    <div className="w-full">
      <div className="text-sm font-medium capitalize text-gray-800 mb-2 select-none">
        {monthName}
      </div>
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {weekdayNames.map((n, i) => (
          <div key={i} className="px-2 py-1 text-center select-none">
            {n}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {matrix.map((d, i) => {
          const inOtherMonth = d.getMonth() !== monthAnchor.getMonth();
          const dis = (min && isBefore(d, min)) || (max && isAfter(d, max)) || (disabled?.(d) ?? false);
          const isStart = isSameDay(d, start);
          const isEnd = isSameDay(d, end);

          // Hover preview for a draft range
          const preview = draftStart && !end && hoverDate ? inRangeInclusive(d, draftStart, hoverDate) : false;
          const active = inRangeInclusive(d, start, end);

          const baseClasses = [
            "relative h-9 rounded-md flex items-center justify-center text-sm transition cursor-pointer select-none",
            inOtherMonth ? "text-gray-400" : "text-gray-800",
            dis ? "opacity-40 pointer-events-none" : "hover:bg-gray-100",
          ].join(" ");

          const ringClasses = [
            active || preview ? "bg-blue-50" : "",
            isStart || isEnd ? "ring-2 ring-blue-500 bg-blue-500 text-white" : "",
          ].join(" ");

          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => onHover(d)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onPick(d)}
              aria-label={new Intl.DateTimeFormat(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(d)}
              className={`${baseClasses} ${ringClasses}`}
            >
              <span className="z-10">{dayLabel(d, locale)}</span>
              {/* Range background connectors */}
              {(active || preview) && !isStart && !isEnd && (
                <span className="absolute inset-0 bg-blue-100 rounded-md" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===== Main Component =====
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  locale = "es-PA",
  weekStartsOn = 1,
  min,
  max,
  disabled,
  presets,
  numberOfMonths = 2,
  className,  
  setDates,
  dates   
}) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, () => setOpen(false));

  // Normalize incoming value
  const val = useMemo<DateRange>(() => ({
    start: value.start ? atMidnight(value.start) : undefined,
    end: value.end ? atMidnight(value.end) : undefined,
  }), [value.start, value.end]);

  const today = atMidnight(new Date());
  const initialMonth = val.start || val.end || startOfMonth(today); // Mes actual pero sin destacar día
  const [anchor, setAnchor] = useState<Date>(startOfMonth(initialMonth));
  const [draftStart, setDraftStart] = useState<Date | undefined>(undefined);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  useEffect(() => {
    // When value changes externally, adjust anchor
    const ref = val.start || val.end || today;
    setAnchor(startOfMonth(ref));
  }, [val.start, val.end]);

  const leftMonth = startOfMonth(anchor);
  const rightMonth = startOfMonth(addMonths(anchor, 1));

  const handlePrev = () => setAnchor(addMonths(anchor, -1));
  const handleNext = () => setAnchor(addMonths(anchor, 1));

function commit(next: DateRange) {
  // Aplica atMidnight para asegurarte de que solo se guarde la fecha sin la parte de la hora
  const start = next.start ? atMidnight(next.start) : undefined;
  const end = next.end ? atMidnight(next.end) : undefined;

  // Actualiza el valor del rango
  onChange({ start, end });
}

  function pickDate(d: Date) {
    const date = atMidnight(clamp(d, min, max)); // Asegúrate de que solo se guarde la fecha sin la hora

    // Si no tienes una fecha de inicio o ya tienes un rango completo, empieza una nueva selección
    if (!val.start || (val.start && val.end)) {
      setDraftStart(date);
      setHoverDate(null);
      commit({ start: date, end: undefined });
      return;
    }

    // Si tienes una fecha de inicio pero no de fin
    if (val.start && !val.end) {
      let start = val.start;
      let end = date;
      if (isBefore(end, start)) [start, end] = [end, start];
      setDraftStart(undefined);
      setHoverDate(null);
      commit({ start, end });
      setOpen(false);
    }
  }


  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "Escape") setOpen(false);
    if (e.key === "PageUp") {
      e.preventDefault();
      setAnchor(addMonths(anchor, -1));
    }
    if (e.key === "PageDown") {
      e.preventDefault();
      setAnchor(addMonths(anchor, 1));
    }
  }

  const defaultPresets: Preset[] = [
    {
      label: "Hoy",
      range: () => ({ start: today, end: today }),
    },
    {
      label: "Últimos 7 días",
      range: () => ({ start: addDays(today, -6), end: today }),
    },
    {
      label: "Este mes",
      range: () => ({ start: startOfMonth(today), end: today }),
    },
    {
      label: "Mes pasado",
      range: () => {
        const m = addMonths(startOfMonth(today), -1);
        return { start: m, end: endOfMonth(m) };
      },
    },
  ];

  const allPresets = presets && presets.length ? presets : defaultPresets;

const displayText = useMemo(() => {
  const fmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" });
  
  // Solo actualizar dates si hay al menos una fecha seleccionada
  if (val.start || val.end) {
    setDates((prev: any) => ({
      ...prev,
      startDate: val.start ? fmt.format(val.start) : undefined,
      endDate: val.end ? fmt.format(val.end) : undefined
    }));
  } else {
    // Opcional: limpiar dates cuando no hay selección
    setDates(prev => ({
      ...prev,
      startDate: undefined,
      endDate: undefined
    }));
  }
  
  if (val.start && val.end) return `${fmt.format(val.start)} — ${fmt.format(val.end)}`;
  if (val.start) return `${fmt.format(val.start)} — …`;
  return "";
}, [val.start, val.end, locale]);

  return (
    <div className={`relative ${className ?? ""}`} onKeyDown={onKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full inline-flex items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={`truncate ${displayText?'':'text-gray-400'}`}>                    
          {dates.startDate?`${dates.startDate} - ${dates.endDate}`:'Rango de Fecha'}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-70" aria-hidden>
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {/* Panel */}
      {open && (             
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Selector de rango de fechas"
              className="bg-white absolute top-full right-0 left-auto z-50 mt-2 w-[60vh] flex rounded-2xl border border-gray-200 p-4 shadow-xl"
          >
            <div className="flex flex-col  gap-4 w-full">
              {/* Left: Calendar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="rounded-lg p-2 hover:bg-gray-100"
                    aria-label="Mes anterior"
                  >
                    <svg width="20" color="black" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                  </button>
                  
                      <button
                      type="button"
                      onClick={handleNext}
                      className="rounded-lg p-2 hover:bg-gray-100"
                      aria-label="Mes siguiente"
                      >
                      <svg width="20" color="black" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                      </button>
                </div>

                <div className={` grid ${numberOfMonths === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6 `}>
                  <CalendarMonth
                    monthAnchor={leftMonth}
                    value={val}
                    draftStart={draftStart}
                    hoverDate={hoverDate}
                    weekStartsOn={weekStartsOn}
                    locale={locale}
                    min={min}
                    max={max}
                    disabled={disabled}
                    onPick={pickDate}
                    onHover={setHoverDate}    
                    setDates={setDates}
                  />
                  {numberOfMonths === 2 && (
                    <CalendarMonth
                      monthAnchor={rightMonth}
                      value={val}
                      draftStart={draftStart}
                      hoverDate={hoverDate}
                      weekStartsOn={weekStartsOn}
                      locale={locale}
                      min={min}
                      max={max}
                      disabled={disabled}
                      onPick={pickDate}
                      onHover={setHoverDate}
                      setDates={setDates}
                    />
                  )}
                </div>
              </div>

              {/* Right: Presets / Actions */}
              <div className="w-full md: flex flex-col gap-3">
                <div className="text-sm font-medium text-gray-700 w-full">Rangos rápidos</div>
                <div className="grid grid-cols-4 gap-2 w-full">
                  {allPresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        const r = p.range();
                        commit(r);
                        setOpen(false);
                      }}
                      className="bg-blue-200 text-black rounded-lg border border-gray-200 px-2 py-1.5 text-sm hover:bg-blue-400"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => commit({ start: undefined, end: undefined })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-400 hover:bg-gray-600"
                  >
                    Limpiar
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                  >
                    Listo
                  </button>
                </div>
              </div>
            </div>
          </div>        
      )}
    </div>
  );
};


// ===== Demo page (default export) =====
const DatePickerRange = ({setDates, dates}:DatePickerRangeProps) => {
  const [range, setRange] = useState<DateRange>({});
  // Example of min/max & disabled predicate (weekends disabled)
  const minDate = addMonths(atMidnight(new Date()), -6);
  const maxDate = addMonths(atMidnight(new Date()), 6);
  const disableWeekends = (d: Date) => [0, 6].includes(d.getDay());
  
  return (
    <div className="w-full flex items-start justify-center from-white to-slate-50">
      <div className="w-full max-w-3xl ">        

        <div className="grid gap-4 ">
          <div>            
            <DateRangePicker
              value={range}
              onChange={setRange}
              locale="es-PA"
              weekStartsOn={1}
              min={minDate}
              max={maxDate}
              disabled={disableWeekends}
              numberOfMonths={2}
              setDates={setDates}
              dates={dates}
            />
          </div>          
        </div>
      </div>
    </div>
  );
};
export default DatePickerRange;