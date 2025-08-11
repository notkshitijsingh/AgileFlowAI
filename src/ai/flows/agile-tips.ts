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

const AgileTipInputSchema = z.object({
  projectPhase: z
    .string()
    .describe('The current phase of the project (e.g., planning, execution, review).'),
  userInteraction: z
    .string()
    .describe(
      'A description of the latest user interaction or action performed in the project management tool.'
    ),
});
export type AgileTipInput = z.infer<typeof AgileTipInputSchema>;

const AgileTipOutputSchema = z.object({
  tip: z
    .string()
    .describe(
      'An agile best practice tip relevant to the current project phase and user interaction.'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the provided tip, explaining why it is relevant and how it can improve project outcomes.'
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
  prompt: `You are an AI-powered agile project management assistant. Provide a single, actionable agile best practice tip that is most relevant to the current project phase and recent user interaction. Also explain your reasoning behind the provided tip.

Project Phase: {{{projectPhase}}}
User Interaction: {{{userInteraction}}}

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
