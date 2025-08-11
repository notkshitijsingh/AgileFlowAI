'use server';

/**
 * @fileOverview This file defines a Genkit flow for initializing a project board based on project details.
 *
 * The flow takes project details as input and generates an initial project board configuration with
 * suggested tasks and columns relevant to the project.
 *
 * @exports {
 *   initializeBoard,
 *   BoardInitializationInput,
 *   BoardInitializationOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BoardInitializationInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  teamMembers: z.string().describe('A comma-separated list of team member names.'),
  durationWeeks: z.number().describe('The duration of the project in weeks.'),
});

export type BoardInitializationInput = z.infer<typeof BoardInitializationInputSchema>;

const BoardInitializationOutputSchema = z.object({
  columns: z.array(
    z.object({
      name: z.string().describe('The name of the column (e.g., To Do, In Progress, Done).'),
      tasks: z.array(
        z.object({
          name: z.string().describe('The name of the task.'),
          description: z.string().describe('A brief description of the task.'),
        })
      ).describe('A list of tasks for this column.')
    })
  ).describe('An array of columns, each containing a name and a list of tasks.')
});

export type BoardInitializationOutput = z.infer<typeof BoardInitializationOutputSchema>;


export async function initializeBoard(input: BoardInitializationInput): Promise<BoardInitializationOutput> {
  return initializeBoardFlow(input);
}

const initializeBoardPrompt = ai.definePrompt({
  name: 'initializeBoardPrompt',
  input: {schema: BoardInitializationInputSchema},
  output: {schema: BoardInitializationOutputSchema},
  prompt: `You are a project management expert. Given the following project details, generate an initial project board configuration with suggested columns and tasks. The response must be valid JSON matching the BoardInitializationOutputSchema schema.

Project Name: {{{projectName}}}
Team Members: {{{teamMembers}}}
Duration (weeks): {{{durationWeeks}}}

Consider the project name, team members, and duration when suggesting relevant columns and tasks.  Be concise but provide enough tasks so the board is useful.
`,
});

const initializeBoardFlow = ai.defineFlow(
  {
    name: 'initializeBoardFlow',
    inputSchema: BoardInitializationInputSchema,
    outputSchema: BoardInitializationOutputSchema,
  },
  async input => {
    const {output} = await initializeBoardPrompt(input);
    return output!;
  }
);
