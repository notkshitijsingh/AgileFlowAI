'use server';

import { suggestStories, type StorySuggestionInput, type StorySuggestionOutput } from '@/ai/flows/story-suggestion';

export async function suggestStoriesAction(input: StorySuggestionInput): Promise<StorySuggestionOutput> {
  const stories = await suggestStories(input);
  return stories;
}
