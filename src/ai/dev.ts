import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-packing-list.ts';
import '@/ai/flows/generate-trip-announcements-flow.ts';
import '@/ai/flows/generate-itinerary-description.ts';