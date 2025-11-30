import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerWithRangeProps {
    className?: string;
    onChange?: (date: DateRange | undefined) => void;
    placeholder?: string;
    date?: DateRange | undefined;
}

export function DatePickerWithRange({
    className,
    onChange,
    placeholder = "Pick a date range",
    date,
}: DatePickerWithRangeProps) {
    const handleSelect = (selectedDate: DateRange | undefined) => {
        if (onChange) {
            onChange(selectedDate);
        }
    };

    return (
        <div className={cn("gap-2 grid", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "justify-start w-full font-normal text-left",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 size-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                        className={cn("p-3 pointer-events-auto")}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
