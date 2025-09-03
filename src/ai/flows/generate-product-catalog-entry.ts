'use server';

/**
 * @fileOverview Generates a product catalog entry with title, description, keywords, and translations.
 *
 * - generateProductCatalogEntry - A function that generates the product catalog entry.
 * - GenerateProductCatalogEntryInput - The input type for the generateProductCatalogEntry function.
 * - GenerateProductCatalogEntryOutput - The return type for the generateProductCatalogEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateProductCatalogEntryInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product (e.g., painting, saree, pottery).'),
  notes: z.string().optional().describe('Optional notes about the product.'),
  image: z.string().describe(
    'A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' ),
});

export type GenerateProductCatalogEntryInput = z.infer<typeof GenerateProductCatalogEntryInputSchema>;

const GenerateProductCatalogEntryOutputSchema = z.object({
  title: z.string().describe('An attractive product title.'),
  description: z.string().describe('A modern and engaging product description.'),
  keywords: z.string().describe('Relevant keywords and hashtags for the product.'),
  translations: z.object({
    english: z.string().describe('Product information translated into English.'),
    hindi: z.string().describe('Product information translated into Hindi.'),
    gujarati: z.string().describe('Product information translated into Gujarati.'),
  }).describe('Translations of the product information in various regional languages.'),
});

export type GenerateProductCatalogEntryOutput = z.infer<typeof GenerateProductCatalogEntryOutputSchema>;

export async function generateProductCatalogEntry(
  input: GenerateProductCatalogEntryInput
): Promise<GenerateProductCatalogEntryOutput> {
  return generateProductCatalogEntryFlow(input);
}

const generateProductCatalogEntryPrompt = ai.definePrompt({
  name: 'generateProductCatalogEntryPrompt',
  input: {schema: GenerateProductCatalogEntryInputSchema},
  output: {schema: GenerateProductCatalogEntryOutputSchema},
  prompt: `You are an expert in creating compelling product catalog entries for Indian artisan products.

  Given the following product information, generate an attractive product title, a modern and engaging product description, and relevant keywords/hashtags.
  Also, translate the generated content into English, Hindi, and Gujarati.

  Product Name: {{{productName}}}
  Category: {{{category}}}
  Notes: {{{notes}}}
  Image: {{media url=image}}

  Ensure that the generated content is culturally relevant and appealing to a wide audience.
  Provide translations that accurately convey the product's essence in each language.

  Output the result as a JSON object with the following keys: title, description, keywords, and translations (english, hindi, gujarati).
  `,
});

const generateProductCatalogEntryFlow = ai.defineFlow(
  {
    name: 'generateProductCatalogEntryFlow',
    inputSchema: GenerateProductCatalogEntryInputSchema,
    outputSchema: GenerateProductCatalogEntryOutputSchema,
  },
  async input => {
    const {output} = await generateProductCatalogEntryPrompt(input);
    return output!;
  }
);
