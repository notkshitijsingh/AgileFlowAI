"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2, ArrowLeft } from "lucide-react";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  stories: z.array(z.string().min(10, {
    message: "User story must be at least 10 characters.",
  })).min(1, { message: "At least one user story is required." }),
});

export type StoryReviewFormValues = z.infer<typeof formSchema>;

interface StoryReviewProps {
  initialStories: string[];
  onSubmit: (values: StoryReviewFormValues) => void;
  isLoading: boolean;
  onBack: () => void;
}

export function StoryReview({ initialStories, onSubmit, isLoading, onBack }: StoryReviewProps) {
  const form = useForm<StoryReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stories: initialStories,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stories",
  });

  return (
    <Card className="w-full max-w-2xl shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack} type="button">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="font-headline text-2xl">Review User Stories</CardTitle>
                <CardDescription>
                  Add, edit, or remove the suggested stories before generating the board.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto p-6">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`stories.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-2">
                      <FormControl>
                        <Textarea
                          placeholder="As a <user type>, I want <goal> so that <benefit>"
                          {...field}
                          className="resize-y"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive/70 hover:text-destructive shrink-0"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
             <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => append("")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User Story
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Generating Board..." : "Generate Scrum Board"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
