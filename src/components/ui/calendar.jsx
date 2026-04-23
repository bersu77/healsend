import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import {
  DayPicker,
  DayFlag,
  getDefaultClassNames,
  SelectionState,
  UI,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...defaultClassNames,
        [UI.Months]: cn(
          "flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 sm:gap-y-0",
          defaultClassNames[UI.Months]
        ),
        [UI.Month]: cn("flex flex-col gap-y-4", defaultClassNames[UI.Month]),
        [UI.MonthCaption]: cn(
          "flex justify-center pt-1 relative items-center w-full",
          defaultClassNames[UI.MonthCaption]
        ),
        [UI.CaptionLabel]: cn(
          "text-sm font-medium",
          defaultClassNames[UI.CaptionLabel]
        ),
        [UI.Nav]: cn(
          "flex items-center justify-between absolute inset-x-0 top-1",
          defaultClassNames[UI.Nav]
        ),
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: "outline" }),
          "z-10 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1",
          defaultClassNames[UI.PreviousMonthButton]
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: "outline" }),
          "z-10 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1",
          defaultClassNames[UI.NextMonthButton]
        ),
        [UI.MonthGrid]: cn("w-full border-collapse", defaultClassNames[UI.MonthGrid]),
        [UI.Weekdays]: cn("flex", defaultClassNames[UI.Weekdays]),
        [UI.Weekday]: cn(
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          defaultClassNames[UI.Weekday]
        ),
        [UI.Week]: cn("flex w-full mt-2", defaultClassNames[UI.Week]),
        [UI.Day]: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
          defaultClassNames[UI.Day]
        ),
        [UI.DayButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
          defaultClassNames[UI.DayButton]
        ),
        [SelectionState.range_start]: cn(
          "day-range-start",
          defaultClassNames[SelectionState.range_start]
        ),
        [SelectionState.range_end]: cn(
          "day-range-end",
          defaultClassNames[SelectionState.range_end]
        ),
        [SelectionState.selected]: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          defaultClassNames[SelectionState.selected]
        ),
        [SelectionState.range_middle]: cn(
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
          defaultClassNames[SelectionState.range_middle]
        ),
        [DayFlag.today]: cn(
          "bg-accent text-accent-foreground",
          defaultClassNames[DayFlag.today]
        ),
        [DayFlag.outside]: cn(
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          defaultClassNames[DayFlag.outside]
        ),
        [DayFlag.disabled]: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames[DayFlag.disabled]
        ),
        [DayFlag.hidden]: cn("invisible", defaultClassNames[DayFlag.hidden]),
        ...classNames,
      }}
      components={{
        Chevron: ({ className: iconClassName, orientation, ...rest }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeft
              : orientation === "right"
                ? ChevronRight
                : orientation === "down"
                  ? ChevronDown
                  : ChevronRight
          return <Icon className={cn("h-4 w-4", iconClassName)} {...rest} />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
