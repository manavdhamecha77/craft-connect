'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating cultural stories for artisan products.
 *
 * The flow takes product name, artisan name/region, and short notes as input and generates a cultural/heritage story
 * describing the craft’s history, uniqueness, and emotional value.
 *
 * @exports `generateCulturalStory` - The main function to trigger the flow.
 * @exports `GenerateCulturalStoryInput` - The input type for the generateCulturalStory function.
 * @exports `GenerateCulturalStoryOutput` - The return type for the generateCulturalStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCulturalStoryInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  artisanName: z.string().describe('The name of the artisan.'),
  artisanRegion: z.string().describe('The region of the artisan.'),
  notes: z.string().describe('Additional notes about the product or its cultural significance.'),
});

export type GenerateCulturalStoryInput = z.infer<typeof GenerateCulturalStoryInputSchema>;

const GenerateCulturalStoryOutputSchema = z.object({
  culturalStory: z.string().describe('A cultural/heritage story describing the craft’s history, uniqueness, and emotional value.'),
});

export type GenerateCulturalStoryOutput = z.infer<typeof GenerateCulturalStoryOutputSchema>;

/**
 * Wrapper function to generate a cultural story for an artisan product.
 * @param input - The input data for generating the cultural story.
 * @returns A promise that resolves to the generated cultural story.
 */
export async function generateCulturalStory(input: GenerateCulturalStoryInput): Promise<GenerateCulturalStoryOutput> {
  return generateCulturalStoryFlow(input);
}

const generateCulturalStoryPrompt = ai.definePrompt({
  name: 'generateCulturalStoryPrompt',
  input: {schema: GenerateCulturalStoryInputSchema},
  output: {schema: GenerateCulturalStoryOutputSchema},
  prompt: `You are a skilled storyteller specializing in crafting narratives that highlight the cultural and historical significance of artisan products.

  Given the following information about a product, create a compelling story that captures its heritage, uniqueness, and emotional value.

  Product Name: {{{productName}}}
  Artisan Name: {{{artisanName}}}
  Artisan Region: {{{artisanRegion}}}
  Additional Notes: {{{notes}}}

  Your story should be engaging and informative, designed to resonate with potential customers and convey the rich background of the craft.
  The story should be no more than 200 words.
  Please provide the story in a JSON format, under the field name \"culturalStory\".`,
});

const generateCulturalStoryFlow = ai.defineFlow(
  {
    name: 'generateCulturalStoryFlow',
    inputSchema: GenerateCulturalStoryInputSchema,
    outputSchema: GenerateCulturalStoryOutputSchema,
  },
  async input => {
    const {output} = await generateCulturalStoryPrompt(input);
    return output!;
  }
);
