"use client";

import { useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { getAgileTipAction } from "@/app/actions/agile-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { Board } from "@/lib/types";

interface AgileTipData {
  tip: string;
  reasoning: string;
}

export function AgileTip({ board }: { board: Board | null }) {
  const [tip, setTip] = useState<AgileTipData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTip = async () => {
    if (!board) return;
    setIsLoading(true);
    setTip(null);
    try {
      // Pass the current board state to the AI
      const result = await getAgileTipAction({
        board: JSON.stringify(board, null, 2), // Send the entire board state as a string
      });
      setTip(result);
    } catch (error) {
      console.error("Failed to fetch agile tip:", error);
      // Optionally show a toast error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={fetchTip} disabled={isLoading || !board} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Tip...
          </>
        ) : (
          <>
            <Lightbulb className="mr-2 h-4 w-4" />
            Get Agile Tip
          </>
        )}
      </Button>

      {tip && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle className="font-headline">{tip.tip}</AlertTitle>
          <AlertDescription>{tip.reasoning}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
