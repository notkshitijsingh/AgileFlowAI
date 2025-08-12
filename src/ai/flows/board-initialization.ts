'use server';

/**
 * @fileOverview This file defines a Genkit flow for initializing a project board based on project details and user stories.
 *
 * The flow takes project details and a list of user-verified stories as input and generates an initial 
 * Scrum board configuration with suggested columns (Epics/Features) and tasks.
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
  stories: z.array(z.string()).describe('A list of user-verified user stories.')
});

export type BoardInitializationInput = z.infer<typeof BoardInitializationInputSchema>;

const BoardInitializationOutputSchema = z.object({
  columns: z.array(
    z.object({
      name: z.string().describe('The name of the column (e.g., an Epic or Feature like "User Authentication" or "Product Catalog").'),
      description: z.string().describe('The user story that this column/epic is based on.'),
      tasks: z.array(
        z.object({
          name: z.string().describe('The name of the task (a small, actionable item).'),
          description: z.string().describe('A brief description of the task.'),
          storyPoints: z.number().describe('An estimated story point value for the task, from 1 to 8, based on complexity.'),
          assignedTo: z.string().optional().describe('The name of the team member this task is assigned to.')
        })
      ).describe('A list of tasks for this column.')
    })
  ).describe('An array of columns, each representing a high-level feature or epic, containing a name and a list of tasks.')
});

export type BoardInitializationOutput = z.infer<typeof BoardInitializationOutputSchema>;


export async function initializeBoard(input: BoardInitializationInput): Promise<BoardInitializationOutput> {
  return initializeBoardFlow(input);
}

const initializeBoardPrompt = ai.definePrompt({
  name: 'initializeBoardPrompt',
  input: {schema: BoardInitializationInputSchema},
  output: {schema: BoardInitializationOutputSchema},
  prompt: `You are an expert Scrum Master. Given the following project details and user stories, generate an initial Scrum board configuration. 
The columns should represent high-level features or epics derived from the stories. Each column should contain a list of smaller, actionable tasks required to implement that feature.
For each column, populate the 'description' field with the primary user story it relates to.
For each task, provide an estimated story point value between 1 and 8. A higher number means more complexity, effort, and/or uncertainty. Use a simplified Fibonacci-like scale (1, 2, 3, 5, 8).
Intelligently assign each task to a team member from the provided list. If the list is empty, do not assign anyone.
The response must be valid JSON matching the BoardInitializationOutputSchema schema.

Project Name: {{{projectName}}}
Team Members: {{{teamMembers}}}
Duration (weeks): {{{durationWeeks}}}

User Stories:
{{#each stories}}
- {{{this}}}
{{/each}}

Based on these stories, generate the board.
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
