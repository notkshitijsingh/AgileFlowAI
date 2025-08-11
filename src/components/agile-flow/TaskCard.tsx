"use client";

import { useState } from "react";
import { CalendarIcon, Link2, Trash2, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskCardProps {
  task: Task;
  allTasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string, columnId: string) => void;
}

export function TaskCard({ task, allTasks, onUpdate, onDelete }: TaskCardProps) {
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDueDate(date);
      onUpdate({ ...task, dueDate: date });
    }
  };
  
  const handleDependencyChange = (dependencyId: string) => {
    const dependencies = task.dependencies ? [...task.dependencies] : [];
    if (!dependencies.includes(dependencyId)) {
        onUpdate({ ...task, dependencies: [...dependencies, dependencyId] });
    }
  };

  const removeDependency = (depId: string) => {
    const newDeps = task.dependencies?.filter(d => d !== depId);
    onUpdate({ ...task, dependencies: newDeps });
  }

  const availableTasksForDependency = allTasks.filter(t => t.id !== task.id && !task.dependencies?.includes(t.id));

  return (
    <Card className="bg-white dark:bg-card hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
            <span className="text-base font-semibold">{task.name}</span>
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
        </CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {task.dependencies && task.dependencies.length > 0 && (
          <div className="mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Dependencies</h4>
            <div className="flex flex-wrap gap-1">
              {task.dependencies.map(depId => {
                  const depTask = allTasks.find(t => t.id === depId);
                  return (
                      <div key={depId} className="flex items-center bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                          <span>{depTask?.name || 'Unknown Task'}</span>
                          <button onClick={() => removeDependency(depId)} className="ml-1 text-destructive/70 hover:text-destructive">
                            <Trash2 className="h-3 w-3"/>
                          </button>
                      </div>
                  )
              })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm">
        <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <CalendarIcon className={cn("h-4 w-4", dueDate && "text-primary")} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Link2 className={cn("h-4 w-4", task.dependencies && task.dependencies.length > 0 && "text-primary")} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="space-y-2">
                    <p className="font-medium text-sm">Link Dependency</p>
                    <Select onValueChange={handleDependencyChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a task" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTasksForDependency.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              </PopoverContent>
            </Popover>
        </div>
        <div className="flex items-center gap-2">
          {dueDate && (
            <span className="text-xs text-muted-foreground">{format(dueDate, "MMM d")}</span>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => onDelete(task.id, task.columnId)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
