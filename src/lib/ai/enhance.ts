import { env } from '@/lib/env';

export type EnhanceType = 'title' | 'slug' | 'summary' | 'description' | 'accordion';

export type EnhanceContext = {
  type: EnhanceType;
  currentValue?: string;
  productContext?: {
    name_ar?: string;
    name_en?: string;
    categoryName?: string;
  };
};

export type EnhanceResult = {
  ar: string;
  en: string;
  slug?: string;
};

export async function enhanceCatalogContent(context: EnhanceContext): Promise<EnhanceResult> {
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured');
  }

  const systemPrompt = `You are a bilingual e-commerce content assistant for a cosmetics store. Respond only with a JSON object containing "ar" (Arabic), "en" (English), and optionally "slug" fields. Do not include markdown or explanations.`;

  const userPrompt = buildPrompt(context);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'Kylie Cosmetics Catalog',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed: ${response.status}`);
  }

  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenRouter');
  }

  const cleaned = content.replace(/```json|```/g, '').trim();
  const result = JSON.parse(cleaned) as EnhanceResult;
  return result;
}

function buildPrompt(context: EnhanceContext): string {
  const { type, currentValue, productContext } = context;
  const base = `Product Arabic name: ${productContext?.name_ar ?? ''}, English name: ${productContext?.name_en ?? ''}, Category: ${productContext?.categoryName ?? ''}.`;
  const current = currentValue ? ` Current value: "${currentValue}".` : '';

  switch (type) {
    case 'title':
      return `${base}${current} Suggest a catchy product title in Arabic and English. JSON: { "ar": "...", "en": "...", "slug": "..." }`;
    case 'slug':
      return `${base}${current} Suggest a URL-friendly slug (lowercase, hyphens). JSON: { "ar": "...", "en": "...", "slug": "..." }`;
    case 'summary':
      return `${base}${current} Suggest a short one-sentence product summary/hook in Arabic and English. JSON: { "ar": "...", "en": "..." }`;
    case 'description':
      return `${base}${current} Suggest a short product description in Arabic and English. JSON: { "ar": "...", "en": "..." }`;
    case 'accordion':
      return `${base}${current} Suggest an accordion heading and description in Arabic and English. JSON: { "ar": "heading: description", "en": "heading: description" }`;
    default:
      return `${base}${current} Suggest Arabic and English content. JSON: { "ar": "...", "en": "..." }`;
  }
}
