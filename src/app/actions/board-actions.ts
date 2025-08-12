'use server';

import { initializeBoard, type BoardInitializationInput } from '@/ai/flows/board-initialization';
import type { Board } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function generateBoardAction(input: BoardInitializationInput): Promise<Omit<Board, 'id'>> {
  const aiResponse = await initializeBoard(input);

  // Note: IDs are no longer added here. They will be added on the client-side.
  const boardWithoutIds = aiResponse.columns.map((column) => {
    return {
      name: column.name,
      description: column.description,
      tasks: column.tasks.map((task) => ({
        ...task,
        status: 'Open' as const,
      })),
    };
  });

  return boardWithoutIds;
}
