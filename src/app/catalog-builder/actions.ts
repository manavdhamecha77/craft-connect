"use server";

import {
  generateCulturalStory,
  type GenerateCulturalStoryInput,
} from "@/ai/flows/generate-cultural-story";
import {
  generateMarketingContent,
  type GenerateMarketingContentInput,
} from "@/ai/flows/generate-marketing-content";
import {
  generateProductCatalogEntry,
  type GenerateProductCatalogEntryInput,
} from "@/ai/flows/generate-product-catalog-entry";
import {
  suggestProductPricing,
  type SuggestProductPricingInput,
} from "@/ai/flows/suggest-product-pricing";

type ActionResult<T> = {
    data?: T,
    error?: string,
}

export async function handleGenerateCatalogEntry(
  input: GenerateProductCatalogEntryInput
): Promise<ActionResult<any>> {
  try {
    const output = await generateProductCatalogEntry(input);
    return { data: output };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to generate catalog entry." };
  }
}

export async function handleGenerateCulturalStory(
  input: GenerateCulturalStoryInput
): Promise<ActionResult<any>> {
  try {
    const output = await generateCulturalStory(input);
    return { data: output };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to generate cultural story." };
  }
}

export async function handleSuggestPricing(
  input: SuggestProductPricingInput
): Promise<ActionResult<any>> {
  try {
    const output = await suggestProductPricing(input);
    return { data: output };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to suggest price." };
  }
}

export async function handleGenerateMarketingContent(
  input: GenerateMarketingContentInput
): Promise<ActionResult<any>> {
  try {
    const output = await generateMarketingContent(input);
    return { data: output };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to generate marketing content." };
  }
}
