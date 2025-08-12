
"use client";

import { useState } from "react";
import { RocketIcon, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import type { Board } from "@/lib/types";
import { generateBoardAction } from "@/app/actions/board-actions";
import { ProjectSetupForm, type ProjectSetupFormValues } from "@/components/agile-flow/ProjectSetupForm";
import { StoryReview, type StoryReviewFormValues } from "@/components/agile-flow/StoryReview";
import { ProjectBoard } from "@/components/agile-flow/ProjectBoard";
import { BurndownChart } from "@/components/agile-flow/BurndownChart";
import { AgileTip } from "@/components/agile-flow/AgileTip";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { suggestStoriesAction } from "@/app/actions/story-actions";
import { useToast } from "@/hooks/use-toast";

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

const DashboardSidebar = () => {
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
              <AgileTip />
            </div>
          </SidebarContent>
        </Sidebar>
    )
}

const Dashboard = ({ board, projectName, onReset, teamMembers }: { board: Board, projectName: string, onReset: () => void, teamMembers: string[] }) => {
  return (
    <SidebarProvider>
        <div className="h-screen w-full flex flex-col">
          <DashboardHeader projectName={projectName} onReset={onReset} />
          <div className="flex-1 flex overflow-hidden">
            <DashboardSidebar />
            <SidebarInset className="flex-1 overflow-auto p-4 md:p-6">
              <ProjectBoard initialBoard={board!} teamMembers={teamMembers}/>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
  )
}

export default function Home() {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [setupStep, setSetupStep] = useState<SetupStep>('details');
  const [projectDetails, setProjectDetails] = useState<ProjectSetupFormValues | null>(null);
  const [suggestedStories, setSuggestedStories] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSuggestStories = async (values: ProjectSetupFormValues) => {
    setIsLoading(true);
    setProjectName(values.projectName);
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
      const newBoard = await generateBoardAction({
        ...projectDetails,
        stories: values.stories,
      });
      // The board from the action doesn't have IDs. We'll let the ProjectBoard component handle that.
      setBoard(newBoard as Board); 
      setSetupStep('board');
    } catch (error) {
      console.error("Failed to generate board:", error);
      toast({
        variant: "destructive",
        title: "Failed to Generate Board",
        description: "There was an error creating the board. Please check the stories and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setBoard(null);
    setProjectName("");
    setSetupStep('details');
    setProjectDetails(null);
    setSuggestedStories([]);
  }
  
  const handleBackToDetails = () => {
    setSetupStep('details');
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
        const teamMembers = projectDetails?.teamMembers.split(',').map(tm => tm.trim()).filter(Boolean) || [];
        return (
          <Dashboard board={board!} projectName={projectName} onReset={handleReset} teamMembers={teamMembers} />
        );
    }
  }
  
  return renderContent();
}
