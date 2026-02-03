// This file holds the Genkit flow for generating example sentences for a given word.

'use server';

/**
 * @fileOverview Generates example sentences for a given word using an AI model.
 *
 * - generateSentences - A function that generates example sentences for a given word.
 * - GenerateSentencesInput - The input type for the generateSentences function.
 * - GenerateSentencesOutput - The return type for the generateSentences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSentencesInputSchema = z.object({
  word: z.string().describe('The word for which to generate example sentences.'),
});
export type GenerateSentencesInput = z.infer<typeof GenerateSentencesInputSchema>;

const GenerateSentencesOutputSchema = z.object({
  sentences: z.array(z.string()).describe('An array of example sentences for the given word.'),
});
export type GenerateSentencesOutput = z.infer<typeof GenerateSentencesOutputSchema>;

export async function generateSentences(input: GenerateSentencesInput): Promise<GenerateSentencesOutput> {
  return generateSentencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSentencesPrompt',
  input: {schema: GenerateSentencesInputSchema},
  output: {schema: GenerateSentencesOutputSchema},
  prompt: `You are a helpful AI assistant that generates example sentences for a given word.

  Word: {{{word}}}

  Generate 3 example sentences using the given word. Return the sentences as a JSON array.`,
});

const generateSentencesFlow = ai.defineFlow(
  {
    name: 'generateSentencesFlow',
    inputSchema: GenerateSentencesInputSchema,
    outputSchema: GenerateSentencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
