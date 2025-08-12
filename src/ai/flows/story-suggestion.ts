'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting user stories for a new project.
 *
 * The flow takes basic project details and generates a list of relevant user stories
 * in the standard "As a..., I want..., so that..." format.
 *
 * @exports {
 *   suggestStories,
 *   StorySuggestionInput,
 *   StorySuggestionOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StorySuggestionInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  teamMembers: z.string().describe('A comma-separated list of team member names.'),
  durationWeeks: z.number().describe('The duration of the project in weeks.'),
});

export type StorySuggestionInput = z.infer<typeof StorySuggestionInputSchema>;

const StorySuggestionOutputSchema = z.object({
  stories: z.array(z.string()).describe('An array of suggested user stories.'),
});

export type StorySuggestionOutput = z.infer<typeof StorySuggestionOutputSchema>;


export async function suggestStories(input: StorySuggestionInput): Promise<StorySuggestionOutput> {
  return storySuggestionFlow(input);
}

const storySuggestionPrompt = ai.definePrompt({
  name: 'storySuggestionPrompt',
  input: {schema: StorySuggestionInputSchema},
  output: {schema: StorySuggestionOutputSchema},
  prompt: `You are an expert Scrum Master and product owner. Given the following project details, generate a list of 5 to 8 relevant user stories.
Each user story must follow the format: "As a [user type], I want [goal] so that [benefit]."
The stories should cover the most critical features needed for a minimum viable product based on the project name.

Project Name: {{{projectName}}}
Team Members: {{{teamMembers}}}
Duration (weeks): {{{durationWeeks}}}

Generate the user stories.`,
});

const storySuggestionFlow = ai.defineFlow(
  {
    name: 'storySuggestionFlow',
    inputSchema: StorySuggestionInputSchema,
    outputSchema: StorySuggestionOutputSchema,
  },
  async input => {
    const {output} = await storySuggestionPrompt(input);
    return output!;
  }
);
