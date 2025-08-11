'use server';

import { getAgileTip, type AgileTipInput, type AgileTipOutput } from '@/ai/flows/agile-tips';

export async function getAgileTipAction(input: AgileTipInput): Promise<AgileTipOutput> {
  const tip = await getAgileTip(input);
  return tip;
}
