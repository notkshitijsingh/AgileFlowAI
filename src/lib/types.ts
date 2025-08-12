import type { BoardInitializationOutput } from '@/ai/flows/board-initialization';

export type TaskStatus = 'Open' | 'In Progress' | 'Blocked' | 'Done';

// The raw task object from the AI, without IDs
export type RawTask = BoardInitializationOutput['columns'][0]['tasks'][0] & {
    status: TaskStatus;
    storyPoints: number;
    dueDate?: Date | string;
    dependencies?: string[];
    assignedTo?: string;
}

export interface Task extends RawTask {
  id: string;
  columnId: string;
}

// The raw column object from the AI, without an ID
export type RawColumn = Omit<BoardInitializationOutput['columns'][0], 'tasks'> & {
    tasks: RawTask[]
}

export interface Column extends Omit<RawColumn, 'tasks'> {
  id: string;
  tasks: Task[];
}

export type Board = Column[];
