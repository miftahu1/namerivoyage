'use server';
/**
 * @fileOverview A Genkit flow for generating a packing list based on trip details.
 *
 * - suggestPackingList - A function that handles the packing list suggestion process.
 * - SuggestPackingListInput - The input type for the suggestPackingList function.
 * - SuggestPackingListOutput - The return type for the suggestPackingList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPackingListInputSchema = z.object({
  location: z.string().describe('The location of the trip, e.g., "Nameri National Park".'),
  durationDays: z.number().int().positive().describe('The duration of the trip in days.'),
  activities: z.array(z.string()).describe('A list of planned activities for the trip, e.g., "river rafting", "jungle trekking", "bird watching".'),
});
export type SuggestPackingListInput = z.infer<typeof SuggestPackingListInputSchema>;

const SuggestPackingListOutputSchema = z.object({
  packingList: z.array(z.string()).describe('A comprehensive list of suggested items to pack for the trip.'),
});
export type SuggestPackingListOutput = z.infer<typeof SuggestPackingListOutputSchema>;

export async function suggestPackingList(input: SuggestPackingListInput): Promise<SuggestPackingListOutput> {
  return suggestPackingListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPackingListPrompt',
  input: {schema: SuggestPackingListInputSchema},
  output: {schema: SuggestPackingListOutputSchema},
  prompt: `You are an expert travel planner. Based on the following trip details, suggest a comprehensive and practical packing list.

Consider the location, duration, and planned activities to provide relevant recommendations.

Trip Location: {{{location}}}
Trip Duration: {{{durationDays}}} days
Planned Activities: {{{#each activities}}}{{{this}}}{{#unless @last}}, {{/unless}}{{{/each}}}

Provide the packing list as a JSON array of strings.`,
});

const suggestPackingListFlow = ai.defineFlow(
  {
    name: 'suggestPackingListFlow',
    inputSchema: SuggestPackingListInputSchema,
    outputSchema: SuggestPackingListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
