import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface CalendarProps extends Record<string, any> {
  completedDates: string[];
  streakCount: number;
}

function Calendar({ className, classNames, completedDates = [], streakCount, showOutsideDays = true, ...props }: CalendarProps) {
  // Convert completedDates to Date objects and normalize to the start of the day
  const completedDateObjects = completedDates.map(date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Function to determine streak dates
  const getStreakDates = () => {
    if (streakCount === 0) return []; // No streak, return empty array

    const sortedDates = [...completedDateObjects].sort((a, b) => a.getTime() - b.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

    let streakDates: Date[] = [];
    let count = 0;
    let lastDate = today;

    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const currentDate = sortedDates[i];

      // Check if this date is consecutive with the last added date
      if (count === 0 || (lastDate.getTime() - currentDate.getTime()) === 86400000) {
        streakDates.push(currentDate);
        lastDate = currentDate;
        count++;
      } else {
        break; // Streak is broken
      }

      if (count >= streakCount) break; // Stop when we reach the streak length
    }

    return streakDates;
  };

  const streakDates = getStreakDates();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      modifiers={{
        completed: completedDateObjects,
        streak: streakDates, // Apply streak-specific modifier
      }}
      modifiersClassNames={{
        completed: "!bg-[#003246] !text-white !rounded-full border-2 border-white", // Default completed date style
        streak: "!bg-[#ffa500] !text-white !rounded-full border-2 border-white", // Streak-specific style
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
