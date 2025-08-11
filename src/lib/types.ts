import type { BoardInitializationOutput } from '@/ai/flows/board-initialization';

export interface Task extends BoardInitializationOutput['columns'][0]['tasks'][0] {
  id: string;
  columnId: string;
  dueDate?: Date;
  dependencies?: string[];
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

export type Board = Column[];
