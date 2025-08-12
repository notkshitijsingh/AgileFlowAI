"use client";

import { useState, DragEvent, useMemo, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import type { Board, Task, TaskStatus, Column } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ProjectBoardProps {
  initialBoard: Omit<Column, 'id' | 'tasks'> & { tasks: Omit<Task, 'id' | 'columnId'>[] }[];
  teamMembers: string[];
}

const statusOrder: Record<TaskStatus, number> = {
  'Blocked': 0,
  'In Progress': 1,
  'Open': 2,
  'Done': 3,
};

// This function is now responsible for adding unique IDs to the board
const initializeBoardWithIds = (boardData: ProjectBoardProps['initialBoard']): Board => {
  return boardData.map((column) => {
    const columnId = crypto.randomUUID();
    return {
      ...column,
      id: columnId,
      tasks: column.tasks.map((task) => ({
        ...task,
        id: crypto.randomUUID(),
        columnId: columnId,
      })),
    };
  });
};


export function ProjectBoard({ initialBoard, teamMembers }: ProjectBoardProps) {
  const [board, setBoard] = useState<Board>(() => initializeBoardWithIds(initialBoard));
  const [draggedItem, setDraggedItem] = useState<{ taskId: string; sourceColumnId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // This effect handles cases where the initialBoard prop might change.
  useEffect(() => {
    setBoard(initializeBoardWithIds(initialBoard));
  }, [initialBoard]);


  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({ taskId, sourceColumnId });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    if (columnId !== dragOverColumn) {
      setDragOverColumn(columnId);
    }
  };
  
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { taskId, sourceColumnId } = draggedItem;

    if (sourceColumnId === targetColumnId) {
      setDraggedItem(null);
      setDragOverColumn(null);
      return;
    }

    setBoard((prevBoard) => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      const sourceColumn = newBoard.find((col: any) => col.id === sourceColumnId);
      const targetColumn = newBoard.find((col: any) => col.id === targetColumnId);
      const taskIndex = sourceColumn.tasks.findIndex((task: any) => task.id === taskId);
      const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
      movedTask.columnId = targetColumnId;
      targetColumn.tasks.push(movedTask);
      return newBoard;
    });

    setDraggedItem(null);
    setDragOverColumn(null);
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    setBoard(currentBoard => 
      currentBoard.map(column => 
        column.id === updatedTask.columnId 
          ? { ...column, tasks: column.tasks.map(task => task.id === updatedTask.id ? updatedTask : task) }
          : column
      )
    );
  };
  
  const handleDeleteTask = (taskId: string, columnId: string) => {
    setBoard(currentBoard => 
      currentBoard.map(column => 
        column.id === columnId
          ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
          : column
      )
    );
  };

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: "New Feature",
      description: "A new feature description.",
      columnId,
      status: "Open",
      storyPoints: 1,
    };

    setBoard(currentBoard => 
      currentBoard.map(column => 
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  };
  
  const sortedBoard = useMemo(() => {
    if (!board) return [];
    return board.map(column => ({
      ...column,
      tasks: [...column.tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
    }));
  }, [board]);

  if (!board) {
    return <div>Loading board...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full items-start">
      {sortedBoard.map((column) => (
        <Card 
          key={column.id} 
          className={cn(
            "h-full flex flex-col transition-colors duration-200", 
            dragOverColumn === column.id ? 'bg-primary/10 border-primary' : 'bg-card'
          )}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <CardHeader className="border-b">
            <CardTitle className="font-headline flex justify-between items-center">
              <span>{column.name}</span>
              <span className="text-sm font-medium bg-primary/20 text-primary rounded-full px-2 py-0.5">
                {column.tasks.length}
              </span>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground pt-1">{column.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 overflow-y-auto flex-1">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                className="cursor-move"
              >
                <TaskCard 
                  task={task} 
                  allTasks={board.flatMap(c => c.tasks)} 
                  teamMembers={teamMembers}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))}
             {column.tasks.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>Drop features here</p>
                </div>
             )}
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddTask(column.id)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
