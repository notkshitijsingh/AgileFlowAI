
"use client";

import { useState } from "react";
import { RocketIcon, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import type { Board, RawColumn, Task } from "@/lib/types";
import { ProjectBoard } from "@/components/agile-flow/ProjectBoard";
import { BurndownChart } from "@/components/agile-flow/BurndownChart";
import { AgileTip } from "@/components/agile-flow/AgileTip";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { generateBoardAction } from "@/app/actions/board-actions";
import { ProjectSetupForm, type ProjectSetupFormValues } from "@/components/agile-flow/ProjectSetupForm";
import { StoryReview, type StoryReviewFormValues } from "@/components/agile-flow/StoryReview";
import { suggestStoriesAction } from "@/app/actions/story-actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type SetupStep = 'details' | 'stories' | 'board';


const DashboardHeader = ({ projectName, onReset }: { projectName: string, onReset: () => void}) => {
    const { setOpen } = useSidebar();
    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setOpen(true)} className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md p-1 -ml-1">
                <PanelLeftOpen />
                <RocketIcon className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold font-headline">{projectName}</h1>
              </button>
            </div>
            <Button variant="outline" onClick={onReset}>New Project</Button>
        </header>
    )
}

const DashboardSidebar = ({ board }: { board: Board | null }) => {
    const { setOpen } = useSidebar();
    return (
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarHeader>
              <button onClick={() => setOpen(false)} className="flex w-full items-center justify-between focus:outline-none focus:ring-2 focus:ring-ring rounded-md p-1">
                <h2 className="text-lg font-semibold font-headline">Dashboard</h2>
                <PanelLeftClose />
              </button>
            </SidebarHeader>
            <div className="p-2 space-y-4">
              <BurndownChart />
              <AgileTip board={board} />
            </div>
          </SidebarContent>
        </Sidebar>
    )
}

const Dashboard = ({ board, setBoard, projectName, teamMembers, onReset }: { board: Board, setBoard: (board: Board) => void, projectName: string, teamMembers: string[], onReset: () => void }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="h-screen w-full flex flex-col">
        <DashboardHeader projectName={projectName} onReset={onReset} />
        <div className="flex flex-1">
          <DashboardSidebar board={board} />
          <SidebarInset className="flex-1 overflow-y-auto p-4 md:p-6">
            <ProjectBoard initialBoard={board} teamMembers={teamMembers} onBoardUpdate={setBoard} />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [setupStep, setSetupStep] = useState<SetupStep>('details');
  const [projectDetails, setProjectDetails] = useState<ProjectSetupFormValues | null>(null);
  const [suggestedStories, setSuggestedStories] = useState<string[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const { toast } = useToast();

  const handleSuggestStories = async (values: ProjectSetupFormValues) => {
    setIsLoading(true);
    setProjectDetails(values);
    try {
      const response = await suggestStoriesAction(values);
      setSuggestedStories(response.stories);
      setSetupStep('stories');
    } catch (error) {
      console.error("Failed to suggest stories:", error);
      toast({
        variant: "destructive",
        title: "Failed to Suggest Stories",
        description: "The AI model is currently overloaded. Please try again in a moment.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBoard = async (values: StoryReviewFormValues) => {
    if (!projectDetails) return;
    setIsLoading(true);
    try {
      const rawBoard: RawColumn[] = await generateBoardAction({
        ...projectDetails,
        stories: values.stories,
      });

      // Add client-side IDs to prevent hydration errors and ensure consistency
      const boardWithIds: Board = rawBoard.map(column => {
        const columnId = crypto.randomUUID();
        return {
          ...column,
          id: columnId,
          tasks: column.tasks.map(task => ({
            ...task,
            id: crypto.randomUUID(),
            columnId: columnId,
          })),
        };
      });

      setBoard(boardWithIds);
      setSetupStep('board');
    } catch (error) {
      console.error("Failed to generate board:", error);
       toast({
        variant: "destructive",
        title: "Failed to Generate Board",
        description: "The AI model is currently overloaded. Please check your stories and try again in a moment.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToDetails = () => {
    setSetupStep('details');
  }

  const handleReset = () => {
    setSetupStep('details');
    setBoard(null);
    setProjectDetails(null);
    setSuggestedStories([]);
  }

  const renderContent = () => {
    switch (setupStep) {
      case 'details':
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
            <ProjectSetupForm onSubmit={handleSuggestStories} isLoading={isLoading} />
          </main>
        );
      case 'stories':
        return (
          <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
             <StoryReview 
                initialStories={suggestedStories} 
                onSubmit={handleGenerateBoard} 
                isLoading={isLoading}
                onBack={handleBackToDetails}
             />
          </main>
        );
      case 'board':
        if (board && projectDetails) {
            const teamMembers = projectDetails.teamMembers.split(',').map(m => m.trim());
            return <Dashboard board={board} setBoard={setBoard} projectName={projectDetails.projectName} teamMembers={teamMembers} onReset={handleReset} />;
        }
        return null; // Or a loading/error state
    }
  }
  
  return renderContent();
}
