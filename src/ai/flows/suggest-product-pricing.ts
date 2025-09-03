'use server';

/**
 * @fileOverview A product pricing suggestion AI agent.
 *
 * - suggestProductPricing - A function that suggests a price range for a product.
 * - SuggestProductPricingInput - The input type for the suggestProductPricing function.
 * - SuggestProductPricingOutput - The return type for the suggestProductPricing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductPricingInputSchema = z.object({
  productCategory: z.string().describe('The category of the product (e.g., painting, handloom saree, pottery).'),
  material: z.string().describe('The primary material used in the product (e.g., cotton, silk, clay, wood).'),
  size: z.string().describe('The size of the product (e.g., small, medium, large, or dimensions in cm).'),
  artisanEffortHours: z.number().describe('The number of hours the artisan spent creating the product.'),
});
export type SuggestProductPricingInput = z.infer<typeof SuggestProductPricingInputSchema>;

const SuggestProductPricingOutputSchema = z.object({
  suggestedPriceRangeINR: z.string().describe('The suggested price range for the product in Indian Rupees (INR).'),
  reasoning: z.string().describe('The reasoning behind the suggested price range, based on similar products and factors.'),
});
export type SuggestProductPricingOutput = z.infer<typeof SuggestProductPricingOutputSchema>;

export async function suggestProductPricing(input: SuggestProductPricingInput): Promise<SuggestProductPricingOutput> {
  return suggestProductPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductPricingPrompt',
  input: {schema: SuggestProductPricingInputSchema},
  output: {schema: SuggestProductPricingOutputSchema},
  prompt: `You are an expert in pricing handcrafted artisan products in India. Based on the following information about the product, suggest a reasonable price range in Indian Rupees (INR), and provide a brief justification for your suggestion.

Product Category: {{{productCategory}}}
Material: {{{material}}}
Size: {{{size}}}
Artisan Effort (Hours): {{{artisanEffortHours}}}

Consider factors such as the cost of materials, the time and effort invested by the artisan, the uniqueness of the product, and typical market prices for similar items. Use the following reference dataset (in JSON format) to justify the suggested price range.  If there's a similar product listed in the reference data, the price should match.  If not, determine a fair price based on the factors above. Return the price range in the format \"XXXX - YYYY INR\".

Reference Data:
[
  {
    "productCategory": "painting",
    "material": "watercolor",
    "size": "small",
    "artisanEffortHours": 10,
    "priceRange": "500 - 1000 INR"
  },
  {
    "productCategory": "handloom saree",
    "material": "cotton",
    "size": "large",
    "artisanEffortHours": 40,
    "priceRange": "2000 - 4000 INR"
  },
  {
    "productCategory": "pottery",
    "material": "clay",
    "size": "medium",
    "artisanEffortHours": 15,
    "priceRange": "750 - 1500 INR"
  }
]

Suggested Price Range (INR):`,
});

const suggestProductPricingFlow = ai.defineFlow(
  {
    name: 'suggestProductPricingFlow',
    inputSchema: SuggestProductPricingInputSchema,
    outputSchema: SuggestProductPricingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
