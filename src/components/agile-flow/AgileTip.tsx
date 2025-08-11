"use client";

import { useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { getAgileTipAction } from "@/app/actions/agile-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AgileTipData {
  tip: string;
  reasoning: string;
}

export function AgileTip() {
  const [tip, setTip] = useState<AgileTipData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTip = async () => {
    setIsLoading(true);
    setTip(null);
    try {
      const result = await getAgileTipAction({
        projectPhase: "Execution",
        userInteraction: "User has been moving tasks to 'In Progress'",
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
      <Button onClick={fetchTip} disabled={isLoading} className="w-full">
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
