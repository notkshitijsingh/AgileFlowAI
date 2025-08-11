'use server';

import { initializeBoard, type BoardInitializationInput } from '@/ai/flows/board-initialization';
import type { Board } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function generateBoardAction(input: BoardInitializationInput): Promise<Board> {
  const aiResponse = await initializeBoard(input);

  const boardWithIds: Board = aiResponse.columns.map((column) => {
    const columnId = randomUUID();
    return {
      id: columnId,
      name: column.name,
      tasks: column.tasks.map((task) => ({
        ...task,
        id: randomUUID(),
        columnId: columnId,
      })),
    };
  });

  return boardWithIds;
}
