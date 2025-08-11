"use client";

import { useState, DragEvent } from "react";
import type { Board, Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

interface ProjectBoardProps {
  initialBoard: Board;
}

export function ProjectBoard({ initialBoard }: ProjectBoardProps) {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [draggedItem, setDraggedItem] = useState<{ taskId: string; sourceColumnId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full items-start">
      {board.map((column) => (
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
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))}
             {column.tasks.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>Drop tasks here</p>
                </div>
             )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
