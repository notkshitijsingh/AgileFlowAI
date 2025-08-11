"use client";

import { useState } from "react";
import { RocketIcon } from "lucide-react";
import type { Board } from "@/lib/types";
import { generateBoardAction } from "@/app/actions/board-actions";
import { ProjectSetupForm, type ProjectSetupFormValues } from "@/components/agile-flow/ProjectSetupForm";
import { ProjectBoard } from "@/components/agile-flow/ProjectBoard";
import { BurndownChart } from "@/components/agile-flow/BurndownChart";
import { AgileTip } from "@/components/agile-flow/AgileTip";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState("");

  const handleGenerateBoard = async (values: ProjectSetupFormValues) => {
    setIsLoading(true);
    setProjectName(values.projectName);
    try {
      const newBoard = await generateBoardAction(values);
      setBoard(newBoard);
    } catch (error) {
      console.error("Failed to generate board:", error);
      // Here you would show a toast to the user
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setBoard(null);
    setProjectName("");
  }

  if (!board) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
        <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-primary/20 p-3 rounded-full mb-4">
                <RocketIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground font-headline">Welcome to AgileFlow AI</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                Input your project details and let our AI generate a dynamic Scrum board to kickstart your agile journey.
            </p>
        </div>
        <ProjectSetupForm onSubmit={handleGenerateBoard} isLoading={isLoading} />
      </main>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 shrink-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <RocketIcon className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold font-headline">{projectName}</h1>
            </div>
          </div>
          <Button variant="outline" onClick={handleReset}>New Project</Button>
        </header>
        <div className="flex-1 flex overflow-hidden">
          <Sidebar collapsible="icon">
            <SidebarContent>
              <SidebarHeader>
                <h2 className="text-lg font-semibold font-headline">Dashboard</h2>
              </SidebarHeader>
              <div className="p-2 space-y-4">
                <BurndownChart />
                <AgileTip />
              </div>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex-1 overflow-auto p-4 md:p-6">
            <ProjectBoard initialBoard={board} />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
