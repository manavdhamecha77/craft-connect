"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]).describe("Message role"),
  content: z.string().describe("Message text content")
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const AskArtisanAssistantInput = z.object({
  messages: z.array(ChatMessageSchema).min(1).describe("Full conversation so far")
});

const AskArtisanAssistantOutput = z.object({
  reply: z.string().describe("Assistant reply text")
});

export type AskArtisanAssistantInputType = z.infer<typeof AskArtisanAssistantInput>;
export type AskArtisanAssistantOutputType = z.infer<typeof AskArtisanAssistantOutput>;

const SYSTEM_CONTEXT = `
You are the CraftConnect AI Artisan Assistant. Your job is to help artisans who sell their handcrafted products on the CraftConnect platform.
Be concise, friendly, and practical. When relevant, refer to the product lifecycle on the site and available features.

Key capabilities and context:
- Platform roles: "artisan" (seller) and "customer" (buyer). An account is permanently assigned to one role.
- Artisan onboarding: After creating an artisan account, they complete an onboarding flow at /onboarding to set up name, region, specialization, bio, techniques, inspiration, and goals.
- Artisan dashboard: At /dashboard, artisans see stats, recent activity, and quick actions.
- Product management: At /products, artisans can create, view, edit, publish/unpublish, archive, and delete products.
- Catalog builder: At /catalog-builder, artisans can use AI to generate product titles, descriptions, keywords, translations (English/Hindi/Gujarati), pricing suggestions, and stories. Each listing supports artisanEdits.customPrice, overriding base price.
- Marketplace: At /marketplace (customer-facing), published products are visible to customers; ratings and reviews are available when delivered.
- Orders: At /orders (customer view) and the new Order Details page /orders/[id].
- Authentication & navigation protections: Auth pages at /auth, protected pages redirect properly, and role-based actions are enforced.

Guidance:
- When asked "how do I" questions, give step-by-step instructions using page paths.
- When asked about best practices (pricing, descriptions, etc.), provide actionable suggestions.
- If a question requires data that only the UI shows (e.g., exact product count), explain where to find it in the dashboard.
- If asked for unsafe actions or anything not supported, explain the limitation and suggest safe alternatives.
`;

const askArtisanAssistantPrompt = ai.definePrompt({
  name: "askArtisanAssistantPrompt",
  input: { schema: AskArtisanAssistantInput },
  output: { schema: AskArtisanAssistantOutput },
  prompt: `{{#system}}
${SYSTEM_CONTEXT}
{{/system}}

The following is the conversation so far:
{{#each messages}}
[{{role}}] {{content}}
{{/each}}

Respond as the CraftConnect AI Artisan Assistant. Keep responses concise and useful. Provide lists or steps when helpful.
Return strictly as JSON with key: reply.
`,
});

const askArtisanAssistantFlow = ai.defineFlow(
  {
    name: "askArtisanAssistantFlow",
    inputSchema: AskArtisanAssistantInput,
    outputSchema: AskArtisanAssistantOutput,
  },
  async (input) => {
    const { output } = await askArtisanAssistantPrompt(input);
    return output!;
  }
);

export async function askArtisanAssistant(
  input: AskArtisanAssistantInputType
): Promise<AskArtisanAssistantOutputType> {
  return askArtisanAssistantFlow(input);
}

