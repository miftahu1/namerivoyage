'use server';
/**
 * @fileOverview A Genkit flow for generating engaging trip announcements for students.
 *
 * - generateTripAnnouncements - A function that handles the generation of trip announcements.
 * - GenerateTripAnnouncementsInput - The input type for the generateTripAnnouncements function.
 * - GenerateTripAnnouncementsOutput - The return type for the generateTripAnnouncements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTripAnnouncementsInputSchema = z.object({
  tripName: z
    .string()
    .describe('The name of the trip, e.g., "Class 12 Nameri Trip – Arunodoi Academy"'),
  announcementTopic: z
    .string()
    .describe(
      'The main topic of the announcement, e.g., "Change in departure time", "Packing list reminder", "New activity added"'
    ),
  announcementDetails: z
    .string()
    .describe(
      'Specific details and information to include in the announcement, e.g., "New departure time is 7:00 AM instead of 8:00 AM", "Bring an extra pair of socks and a rain jacket"'
    ),
  currentDate: z.string().describe('The current date, formatted as a string (e.g., "October 26, 2023").'),
});
export type GenerateTripAnnouncementsInput = z.infer<
  typeof GenerateTripAnnouncementsInputSchema
>;

const GenerateTripAnnouncementsOutputSchema = z.object({
  announcementText: z.string().describe('The drafted, engaging announcement for students.'),
});
export type GenerateTripAnnouncementsOutput = z.infer<
  typeof GenerateTripAnnouncementsOutputSchema
>;

export async function generateTripAnnouncements(
  input: GenerateTripAnnouncementsInput
): Promise<GenerateTripAnnouncementsOutput> {
  return generateTripAnnouncementsFlow(input);
}

const generateAnnouncementsPrompt = ai.definePrompt({
  name: 'generateAnnouncementsPrompt',
  input: {schema: GenerateTripAnnouncementsInputSchema},
  output: {schema: GenerateTripAnnouncementsOutputSchema},
  prompt: `You are an assistant for a school administrator, tasked with drafting clear and engaging announcements for students about an upcoming trip.

Craft a concise and informative announcement based on the following details. Ensure the tone is friendly, encouraging, and clear.

Trip Name: {{{tripName}}}
Announcement Topic: {{{announcementTopic}}}
Details: {{{announcementDetails}}}

Today's Date: {{{currentDate}}}

Draft the announcement text below, starting with a suitable greeting to the students and ending with a positive closing remark.`,
});

const generateTripAnnouncementsFlow = ai.defineFlow(
  {
    name: 'generateTripAnnouncementsFlow',
    inputSchema: GenerateTripAnnouncementsInputSchema,
    outputSchema: GenerateTripAnnouncementsOutputSchema,
  },
  async input => {
    const {output} = await generateAnnouncementsPrompt(input);
    return output!;
  }
);
