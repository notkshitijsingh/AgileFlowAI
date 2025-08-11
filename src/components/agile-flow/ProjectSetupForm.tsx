"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { BoardInitializationInput } from "@/ai/flows/board-initialization";

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  teamMembers: z.string().min(1, {
    message: "Please enter at least one team member.",
  }),
  durationWeeks: z.coerce.number().min(1, {
    message: "Duration must be at least 1 week.",
  }),
});

export type ProjectSetupFormValues = z.infer<typeof formSchema>;

interface ProjectSetupFormProps {
  onSubmit: (values: ProjectSetupFormValues) => void;
  isLoading: boolean;
}

export function ProjectSetupForm({ onSubmit, isLoading }: ProjectSetupFormProps) {
  const form = useForm<ProjectSetupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      teamMembers: "",
      durationWeeks: 4,
    },
  });

  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create Your Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., E-commerce Platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Alice, Bob, Charlie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationWeeks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Duration (in weeks)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Generating Board..." : "Generate Project Board"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
