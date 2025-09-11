'use server';

/**
 * @fileOverview This file implements the Genkit flow for intelligent answer checking.
 *
 * - intelligentAnswerCheck - A function that checks if the student's answer is substantially equivalent to the expected answer.
 * - IntelligentAnswerCheckInput - The input type for the intelligentAnswerCheck function.
 * - IntelligentAnswerCheckOutput - The return type for the intelligentAnswerCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentAnswerCheckInputSchema = z.object({
  studentAnswer: z.string().describe('The answer provided by the student.'),
  expectedAnswer: z.string().describe('The expected correct answer.'),
  subject: z.string().describe('The subject of the question (e.g., physics).'),
});
export type IntelligentAnswerCheckInput = z.infer<typeof IntelligentAnswerCheckInputSchema>;

const IntelligentAnswerCheckOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the student answer is substantially equivalent to the expected answer.'),
  explanation: z.string().describe('An explanation of why the answer is considered correct or incorrect.'),
});
export type IntelligentAnswerCheckOutput = z.infer<typeof IntelligentAnswerCheckOutputSchema>;

export async function intelligentAnswerCheck(input: IntelligentAnswerCheckInput): Promise<IntelligentAnswerCheckOutput> {
  return intelligentAnswerCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentAnswerCheckPrompt',
  input: {schema: IntelligentAnswerCheckInputSchema},
  output: {schema: IntelligentAnswerCheckOutputSchema},
  prompt: `You are an expert evaluator in {{{subject}}}. Determine if the student's answer is substantially correct, even if it doesn't match the expected answer exactly.

Student's Answer: {{{studentAnswer}}}
Expected Answer: {{{expectedAnswer}}}

Consider the student's answer correct if it demonstrates a similar understanding or arrives at the same conclusion through a different method. Provide a brief explanation for your assessment.

Return a JSON object with 'isCorrect' (true/false) and 'explanation'.`,
});

const intelligentAnswerCheckFlow = ai.defineFlow(
  {
    name: 'intelligentAnswerCheckFlow',
    inputSchema: IntelligentAnswerCheckInputSchema,
    outputSchema: IntelligentAnswerCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
