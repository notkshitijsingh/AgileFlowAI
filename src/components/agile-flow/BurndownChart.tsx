"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const burndownData = [
  { day: "Day 0", ideal: 100, actual: 100 },
  { day: "Day 1", ideal: 90, actual: 100 },
  { day: "Day 2", ideal: 80, actual: 95 },
  { day: "Day 3", ideal: 70, actual: 82 },
  { day: "Day 4", ideal: 60, actual: 70 },
  { day: "Day 5", ideal: 50, actual: 65 },
  { day: "Day 6", ideal: 40, actual: 50 },
  { day: "Day 7", ideal: 30, actual: 42 },
  { day: "Day 8", ideal: 20, actual: 25 },
  { day: "Day 9", ideal: 10, actual: 15 },
  { day: "Day 10", ideal: 0, actual: 5 },
];

const chartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--primary))",
  },
  ideal: {
    label: "Ideal",
    color: "hsl(var(--muted-foreground))",
  },
}

export function BurndownChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Sprint Burndown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burndownData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis
                  label={{ value: 'Story Points', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: '12px' } }}
                  tickLine={false} axisLine={false} tickMargin={8} fontSize={12}
                />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Legend />
                <Line type="monotone" dataKey="ideal" stroke={chartConfig.ideal.color} strokeWidth={2} dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="actual" stroke={chartConfig.actual.color} strokeWidth={2} dot={{ r: 4, fill: chartConfig.actual.color, stroke: 'hsl(var(--background))' }} />
              </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
