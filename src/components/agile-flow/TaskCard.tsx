"use client";

import { useState } from "react";
import { CalendarIcon, Link2, Trash2, GripVertical, CheckCircle, XCircle, CircleDashed, Circle, Edit, Save, X, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface TaskCardProps {
  task: Task;
  allTasks: Task[];
  teamMembers: string[];
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string, columnId: string) => void;
}

const statusConfig: Record<TaskStatus, { label: string; icon: React.FC<any> }> = {
  Open: { label: "Open", icon: Circle },
  "In Progress": { label: "In Progress", icon: CircleDashed },
  Blocked: { label: "Blocked", icon: XCircle },
  Done: { label: "Done", icon: CheckCircle },
};

// Function to get color for story points
const getStoryPointColor = (points: number) => {
    if (points <= 0) return 'hsl(0 0% 100%)';
    if (points >= 8) return 'hsl(0 100% 50%)';
    
    // Gradient from white (hsl(0, 0%, 100%)) to red (hsl(0, 100%, 50%))
    const percentage = (points - 1) / (8 - 1);
    
    const lightness = 100 - (50 * percentage);
    const saturation = 100 * percentage;
    
    return `hsl(0 ${saturation}% ${lightness}%)`;
};

export function TaskCard({ task, allTasks, teamMembers, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedStoryPoints, setEditedStoryPoints] = useState(task.storyPoints);


  const handleDateSelect = (date: Date | undefined) => {
    onUpdate({ ...task, dueDate: date });
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

  const handleStatusChange = (status: TaskStatus) => {
    onUpdate({ ...task, status });
  }
  
  const handleEdit = () => {
    setEditedName(task.name);
    setEditedDescription(task.description);
    setEditedStoryPoints(task.storyPoints)
    setIsEditing(true);
  }
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  }
  
  const handleSaveEdit = () => {
    onUpdate({ ...task, name: editedName, description: editedDescription, storyPoints: editedStoryPoints });
    setIsEditing(false);
  }

  const handleAssigneeChange = (assignee: string) => {
    onUpdate({ ...task, assignedTo: assignee });
  };


  const availableTasksForDependency = allTasks.filter(t => t.id !== task.id && !task.dependencies?.includes(t.id));
  const currentStatus = statusConfig[task.status];
  const dueDate = task.dueDate ? new Date(task.dueDate) : undefined;

  return (
    <Card className="bg-white dark:bg-card hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
            {isEditing ? (
              <Input 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)} 
                className="text-base font-semibold h-8"
              />
            ) : (
              <span className="text-base font-semibold">{task.name}</span>
            )}
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab shrink-0" />
        </CardTitle>
        {isEditing ? (
          <Textarea 
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="text-sm"
          />
        ) : (
          <CardDescription>{task.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <currentStatus.icon className="mr-2 h-4 w-4" />
              {currentStatus.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(statusConfig).map((statusKey) => {
              const config = statusConfig[statusKey as TaskStatus];
              return (
                <DropdownMenuItem key={statusKey} onSelect={() => handleStatusChange(statusKey as TaskStatus)}>
                   <config.icon className="mr-2 h-4 w-4" />
                  {config.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {task.dependencies && task.dependencies.length > 0 && (
          <div className="mt-4">
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
      <CardFooter className="flex flex-wrap justify-between items-center text-sm gap-y-2">
        <div className="flex gap-1 items-center flex-wrap">
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
            
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600" onClick={handleSaveEdit}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                    <User className={cn("h-4 w-4 mr-1", task.assignedTo && "text-primary")} />
                    {task.assignedTo || 'Unassigned'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={task.assignedTo} onValueChange={handleAssigneeChange}>
                    {teamMembers.map(member => (
                        <DropdownMenuRadioItem key={member} value={member}>{member}</DropdownMenuRadioItem>
                    ))}
                     <DropdownMenuRadioItem value="">Unassigned</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

           {isEditing ? (
              <Input 
                type="number"
                value={editedStoryPoints} 
                onChange={(e) => setEditedStoryPoints(parseInt(e.target.value, 10) || 0)} 
                className="w-16 h-8 text-center"
                min={1}
                max={8}
              />
            ) : (
              <div
                className="flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold text-black"
                style={{ backgroundColor: getStoryPointColor(task.storyPoints) }}
                title={`${task.storyPoints} Story Points`}
              >
                {task.storyPoints}
              </div>
            )}
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
