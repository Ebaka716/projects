"use client";

import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AdvisorPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="relative min-h-screen">
      <main className="flex flex-col items-center pb-32">
        <div className="w-full max-w-[800px] space-y-6">
          <h1 className="text-3xl font-semibold">Advisor Dashboard</h1>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>FA</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Your Financial Advisor</CardTitle>
                <CardDescription>Placeholder Name</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Placeholder description about the financial advisor. Discuss your goals, review your portfolio, and plan for the future.
              </p>
              <p><strong>Contact:</strong> advisor@example.com</p>
              <p><strong>Office Hours:</strong> M-F 9 AM - 5 PM</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Schedule an Appointment</h2>
            <p className="text-sm text-muted-foreground">Select a date to request an appointment. Further details will be confirmed via email.</p>
            <div className="pt-2">
              <Popover>
                <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
} 