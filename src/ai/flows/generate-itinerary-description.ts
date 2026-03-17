'use server';
/**
 * @fileOverview This file implements a Genkit flow to assist administrators in drafting engaging descriptions for itinerary items.
 *
 * - generateItineraryDescription - A function that generates a descriptive text for an itinerary item.
 * - GenerateItineraryDescriptionInput - The input type for the generateItineraryDescription function.
 * - GenerateItineraryDescriptionOutput - The return type for the generateItineraryDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateItineraryDescriptionInputSchema = z.object({
  tripName: z.string().describe('The name of the trip, e.g., "Class 12 Nameri Trip – Arunodoi Academy".'),
  location: z.string().describe('The primary location of the trip, e.g., "Nameri".'),
  activity: z.string().describe('The specific itinerary item for which to generate a description, e.g., "morning jungle safari", "river rafting".'),
  duration: z.string().describe('The planned duration of the activity, e.g., "3 hours", "Half-day".'),
  details: z.string().optional().describe('Any additional specific details or context for the activity that should be included in the description.'),
});
export type GenerateItineraryDescriptionInput = z.infer<typeof GenerateItineraryDescriptionInputSchema>;

const GenerateItineraryDescriptionOutputSchema = z.object({
  description: z.string().describe('An engaging and descriptive text for the itinerary item.'),
});
export type GenerateItineraryDescriptionOutput = z.infer<typeof GenerateItineraryDescriptionOutputSchema>;

export async function generateItineraryDescription(input: GenerateItineraryDescriptionInput): Promise<GenerateItineraryDescriptionOutput> {
  return generateItineraryDescriptionFlow(input);
}

const generateItineraryDescriptionPrompt = ai.definePrompt({
  name: 'generateItineraryDescriptionPrompt',
  input: { schema: GenerateItineraryDescriptionInputSchema },
  output: { schema: GenerateItineraryDescriptionOutputSchema },
  prompt: `You are a professional travel blogger and content creator, specializing in writing exciting and vivid descriptions for travel itineraries. Your goal is to make the reader eager to experience the activity. You need to generate an engaging and descriptive text for a specific itinerary item.

Here is the context for the trip and the specific activity:

Trip Name: {{{tripName}}}
Location: {{{location}}}
Activity: {{{activity}}}
Duration: {{{duration}}}
{{#if details}}
Additional Details: {{{details}}}
{{/if}}

Craft a description that highlights sensory details, potential unique experiences, and the appeal of the activity in this specific location. The description should be captivating and concise, focusing on enticing the reader.

Generated description:`,
});

const generateItineraryDescriptionFlow = ai.defineFlow(
  {
    name: 'generateItineraryDescriptionFlow',
    inputSchema: GenerateItineraryDescriptionInputSchema,
    outputSchema: GenerateItineraryDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await generateItineraryDescriptionPrompt(input);
    return output!;
  }
);
