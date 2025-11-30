"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DateTimePicker24hProps {
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    date?: Date | undefined;
}

export function DateTimePicker24h({
    onChange,
    placeholder = "Pick a date",
    date,
}: DateTimePicker24hProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate && onChange) {
            const newDate = new Date(selectedDate);

            if (date) {
                newDate.setHours(date.getHours());
                newDate.setMinutes(date.getMinutes());
            }

            onChange(newDate);
        } else if (!selectedDate && onChange) {
            onChange(undefined);
        }
    };

    const handleTimeChange = (
        type: "hour" | "minute",
        value: string
    ) => {
        if (date && onChange) {
            const newDate = new Date(date.getTime());

            if (type === "hour") {
                newDate.setHours(parseInt(value));
            } else if (type === "minute") {
                newDate.setMinutes(parseInt(value));
            }

            onChange(newDate);
        } else if (!date && onChange) {
            const newDate = new Date();
            if (type === "hour") {
                newDate.setHours(parseInt(value));
                newDate.setMinutes(0);
            } else {
                newDate.setMinutes(parseInt(value));
            }

            onChange(newDate);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "justify-start w-full font-normal text-left",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {date ? (
                        format(date, "MM/dd/yyyy HH:mm")
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="start">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                    />
                    <div className="flex sm:flex-row flex-col sm:divide-x divide-y sm:divide-y-0 sm:h-[300px]">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={date && date.getHours() === hour ? "default" : "ghost"}
                                        className="sm:w-full aspect-square shrink-0"
                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                                        className="sm:w-full aspect-square shrink-0"
                                        onClick={() => handleTimeChange("minute", minute.toString())}
                                    >
                                        {minute.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}