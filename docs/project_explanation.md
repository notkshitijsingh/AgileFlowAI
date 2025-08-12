# AgileFlow AI: Project Explanation

This document provides a detailed breakdown of the AgileFlow AI project, a GenAI-powered Agile Scrum project management application.

## 1. Project Overview

AgileFlow AI is a web application built with Next.js and React that helps users kickstart and manage agile projects. Its core functionality revolves around using Generative AI to automate the initial setup of a project board and to provide contextual agile coaching.

The user journey is straightforward:
1.  **Project Setup**: The user provides basic project details (name, team members, duration).
2.  **AI-Powered Story Suggestion**: The application sends these details to an AI model to generate a list of relevant user stories.
3.  **Story Verification**: The user is presented with the AI-suggested stories on a review screen where they can add, edit, or delete them to ensure they align with the project vision.
4.  **AI-Powered Board Generation**: The application uses the user-verified stories to call a second AI model, which generates a structured Kanban-style board. The columns represent epics or features derived from the stories, and each column is populated with relevant tasks. The AI also assigns story points and a team member to each task.
5.  **Interactive Project Board**: The user can then interact with this board, moving tasks between columns, changing their status, updating due dates, and managing dependencies.
6.  **Agile Insights**: The application includes features like a burndown chart for tracking progress and an "Agile Tip" generator that provides AI-driven advice based on the project's context.

## 2. Tech Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **UI Library**: React
- **Styling**: Tailwind CSS with ShadCN UI components for a consistent and modern look and feel.
- **AI/Backend Logic**: Genkit is used for creating AI flows, which are exposed to the frontend via Next.js Server Actions.
- **Form Management**: React Hook Form with Zod for validation.
- **Drag & Drop**: Implemented using native HTML5 Drag and Drop APIs.
- **Charts**: Recharts for data visualization (specifically the Burndown Chart).

## 3. Detailed AI Functionality Breakdown

The AI integration is the core of AgileFlow AI and is handled through three distinct Genkit flows. Genkit provides a structured way to define, execute, and manage interactions with large language models (LLMs). Each flow has a defined input schema (what it accepts) and an output schema (what it returns), ensuring predictable and type-safe data exchange.

### 3.1. AI Use Case 1: User Story Suggestion

This is the first interaction the user has with the AI.

- **File**: `src/ai/flows/story-suggestion.ts`
- **Purpose**: To generate a preliminary list of user stories based on a high-level project idea. This saves the user time and helps them think through the initial requirements.
- **Workflow**:
    1.  The user fills out the `ProjectSetupForm` on the main page with the project name, team members, and duration.
    2.  The `handleSuggestStories` function in `page.tsx` calls the `suggestStoriesAction` server action.
    3.  This action invokes the `suggestStories` function from the flow file.
    4.  Inside the flow, the `storySuggestionPrompt` is executed. This prompt is a template that instructs the AI (Gemini) to act as an "expert Scrum Master and product owner." It passes the project details into the template.
    5.  The prompt explicitly asks for 5 to 8 user stories, each following the standard format: "As a [user type], I want [goal] so that [benefit]."
    6.  The AI model processes the request and returns a JSON object that matches the `StorySuggestionOutputSchema`, which specifies an array of strings (`stories`).
    7.  This array of stories is returned to the frontend and displayed in the `StoryReview` component for the user to verify.

### 3.2. AI Use Case 2: Scrum Board Initialization

This is the most complex AI interaction, responsible for creating the entire project structure.

- **File**: `src/ai/flows/board-initialization.ts`
- **Purpose**: To take a verified list of user stories and construct a complete, actionable Scrum board.
- **Workflow**:
    1.  After the user reviews and confirms the stories in the `StoryReview` component, the `handleGenerateBoard` function in `page.tsx` is called.
    2.  This function calls the `generateBoardAction` server action, passing the project details and the final list of user-verified stories.
    3.  The action calls the `initializeBoard` flow.
    4.  The `initializeBoardPrompt` is the core of this step. It instructs the AI to act as an "expert Scrum Master."
    5.  The prompt's instructions are highly specific:
        -   **Generate Columns**: Create columns that represent high-level features or epics derived from the provided user stories. For each column, the AI must populate the `description` field with the primary user story it relates to.
        -   **Generate Tasks**: Within each column, create a list of smaller, actionable tasks required to implement that feature.
        -   **Estimate Story Points**: For each task, assign an estimated story point value between 1 and 8, using a simplified Fibonacci-like scale (1, 2, 3, 5, 8) to represent complexity and effort.
        -   **Assign Tasks**: Intelligently assign each task to a team member from the provided list.
    6.  The AI model processes this complex request and generates a deeply nested JSON object that conforms to the `BoardInitializationOutputSchema`. This schema defines the structure of columns, tasks, names, descriptions, story points, and assignees.
    7.  The server action receives this structured data from the AI and passes it back to the client.
    8.  The `ProjectBoard` component on the client-side then receives this data, adds unique IDs to each column and task (to prevent React hydration errors and manage state), and renders the full interactive Scrum board.

### 3.3. AI Use Case 3: Contextual Agile Tips

This feature provides ongoing, context-aware coaching to the user.

- **File**: `src/ai/flows/agile-tips.ts`
- **Purpose**: To provide relevant, actionable agile/Scrum best practice tips based on the user's current context within the application.
- **Workflow**:
    1.  In the `AgileTip` component, the user clicks the "Get Agile Tip" button.
    2.  The `fetchTip` function calls the `getAgileTipAction` server action.
    3.  The action calls the `getAgileTip` flow, passing a static context for this demo ("Project Phase: Execution", "User Interaction: User has been moving tasks to 'In Progress'"). In a more advanced implementation, this context would be dynamic based on user activity.
    4.  The `agileTipPrompt` instructs the AI to act as an "AI-powered agile project management assistant."
    5.  It asks the AI to provide a single, actionable tip and to explain the `reasoning` behind it.
    6.  The AI returns a JSON object matching the `AgileTipOutputSchema`, containing the `tip` and `reasoning`.
    7.  This data is displayed to the user in an alert box.

## 4. File-by-File Breakdown & Workflow

### 4.1. Main Application Logic (`src/app/page.tsx`)

This is the primary client-side component that orchestrates the user experience and manages the application's state through its multi-step setup process.

- **State Management**: It uses `useState` to manage the core application state:
    - `setupStep`: Tracks the current stage of the setup process ('details', 'stories', 'board').
    - `projectDetails`: Stores the initial form values (name, team, duration).
    - `suggestedStories`: Holds the list of stories returned by the AI.
    - `board`: Holds the final generated project board data. It's `null` initially.
    - `isLoading`: Tracks the loading state during AI calls.
- **Workflow**:
    1.  Initially, it renders the `<ProjectSetupForm />`.
    2.  On submission, `handleSuggestStories` is called. It invokes the story suggestion AI flow and transitions the `setupStep` to 'stories'.
    3.  It then renders the `<StoryReview />` component, passing the AI-generated stories.
    4.  On submission of the reviewed stories, `handleGenerateBoard` is called. This invokes the board initialization AI flow.
    5.  Once the server action returns the board, it updates the `board` state and sets `setupStep` to 'board', which renders the main `<Dashboard />` interface.

### 4.2. Core UI Components (`src/components/agile-flow/`)

- **`ProjectSetupForm.tsx`**: A standard `react-hook-form` component for capturing initial project details.
- **`StoryReview.tsx`**: A new component that allows users to review, edit, add, and delete the AI-suggested user stories before proceeding.
- **`ProjectBoard.tsx`**: Manages the state of the board after it's been generated. It implements drag-and-drop, handles task updates (like status changes), and renders the columns and tasks. **Crucially, this is where client-side unique IDs are added to the AI-generated data.**
- **`TaskCard.tsx`**: Represents a single task. It's draggable and contains all the UI and logic for displaying and editing task details, including status, due dates, dependencies, story points, and assignees.
- **`BurndownChart.tsx`**: Uses `recharts` with static data to simulate a sprint burndown.
- **`AgileTip.tsx`**: Contains the button to trigger the agile tip AI flow and display the result.

## 5. Styling and UI (`src/app/globals.css`, `tailwind.config.ts`)

- **Theme**: Uses a CSS variable-based theme in `src/app/globals.css` for easy theming.
- **Component Library**: ShadCN UI provides the building blocks for the interface.
- **Layout**: Uses a sophisticated, reusable, and collapsible `<Sidebar />` component (`src/components/ui/sidebar.tsx`).
