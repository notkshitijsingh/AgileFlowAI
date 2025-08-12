'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven agile best practice tips.
 *
 * - getAgileTip - A function that retrieves an agile best practice tip based on the project phase and user interactions.
 * - AgileTipInput - The input type for the getAgileTip function.
 * - AgileTipOutput - The return type for the getAgileTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Board } from '@/lib/types';

const AgileTipInputSchema = z.object({
  board: z.string().describe('The current state of the project board as a JSON string. This includes all columns, tasks, their statuses, and story points.'),
});
export type AgileTipInput = z.infer<typeof AgileTipInputSchema>;

const AgileTipOutputSchema = z.object({
  tip: z
    .string()
    .describe(
      'An agile best practice tip relevant to the current project state.'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the provided tip, explaining why it is relevant and how it can improve project outcomes based on the provided board state.'
    ),
});
export type AgileTipOutput = z.infer<typeof AgileTipOutputSchema>;

export async function getAgileTip(input: AgileTipInput): Promise<AgileTipOutput> {
  return agileTipFlow(input);
}

const agileTipPrompt = ai.definePrompt({
  name: 'agileTipPrompt',
  input: {schema: AgileTipInputSchema},
  output: {schema: AgileTipOutputSchema},
  prompt: `You are an AI-powered agile project management assistant. Your goal is to provide a single, actionable agile best practice tip that is highly relevant to the provided project board state. Analyze the columns, tasks, statuses, and point distributions to identify potential improvements, risks, or best practices.

Here is the current board state:
{{{board}}}

Based on this data, provide a specific tip and explain your reasoning. For example, if you see many tasks "In Progress" for a single person, you might suggest a focus on finishing tasks before starting new ones to improve flow. If you see a column with a disproportionate number of story points, you might suggest breaking down the epic into smaller ones.

Tip:
Reasoning:`,
});

const agileTipFlow = ai.defineFlow(
  {
    name: 'agileTipFlow',
    inputSchema: AgileTipInputSchema,
    outputSchema: AgileTipOutputSchema,
  },
  async input => {
    const {output} = await agileTipPrompt(input);
    return output!;
  }
);
