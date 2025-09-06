'use server';

/**
 * @fileOverview Generates marketing content for artisan products.
 *
 * - generateMarketingContent - A function that generates Instagram captions, WhatsApp statuses, and ad scripts.
 * - GenerateMarketingContentInput - The input type for the generateMarketingContent function.
 * - GenerateMarketingContentOutput - The return type for the generateMarketingContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateMarketingContentInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
});
export type GenerateMarketingContentInput = z.infer<typeof GenerateMarketingContentInputSchema>;

const GenerateMarketingContentOutputSchema = z.object({
  instagramCaptions: z.array(z.string()).length(3).describe('Three Instagram captions, each under 30 words.'),
  whatsappStatus: z.string().describe('A WhatsApp status message.'),
  adScript: z.string().describe('A 30-second ad script.'),
  hindiInstagramCaptions: z.array(z.string()).length(3).describe('Three Instagram captions in Hindi, each under 30 words.'),
  hindiWhatsappStatus: z.string().describe('A WhatsApp status message in Hindi.'),
  hindiAdScript: z.string().describe('A 30-second ad script in Hindi.'),
  gujaratiInstagramCaptions: z.array(z.string()).length(3).describe('Three Instagram captions in Gujarati, each under 30 words.'),
  gujaratiWhatsappStatus: z.string().describe('A WhatsApp status message in Gujarati.'),
  gujaratiAdScript: z.string().describe('A 30-second ad script in Gujarati.'),
});
export type GenerateMarketingContentOutput = z.infer<typeof GenerateMarketingContentOutputSchema>;

export async function generateMarketingContent(input: GenerateMarketingContentInput): Promise<GenerateMarketingContentOutput> {
  return generateMarketingContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingContentPrompt',
  input: {schema: GenerateMarketingContentInputSchema},
  output: {schema: GenerateMarketingContentOutputSchema},
  prompt: `You are a marketing expert specializing in crafting social media content for artisan products.

  Given the following product name and description, generate three Instagram captions (under 30 words each), one WhatsApp status, and a 30-second ad script.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}

  Instagram Captions:
  {{output.instagramCaptions}}

  Whatsapp Status:
  {{output.whatsappStatus}}

  Ad Script:
  {{output.adScript}}
  
  Now translate the content to Hindi and Gujarati.
  
  Hindi Instagram Captions:
  {{output.hindiInstagramCaptions}}
  
  Hindi Whatsapp Status:
  {{output.hindiWhatsappStatus}}
  
  Hindi Ad Script:
  {{output.hindiAdScript}}
  
  Gujarati Instagram Captions:
  {{output.gujaratiInstagramCaptions}}
  
  Gujarati Whatsapp Status:
  {{output.gujaratiWhatsappStatus}}
  
  Gujarati Ad Script:
  {{output.gujaratiAdScript}}`,
});

const generateMarketingContentFlow = ai.defineFlow(
  {
    name: 'generateMarketingContentFlow',
    inputSchema: GenerateMarketingContentInputSchema,
    outputSchema: GenerateMarketingContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
