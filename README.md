# AgileFlow AI 🤖✨

<p align="center">
  <strong>Your intelligent Agile Scrum partner. Describe your project, and let GenAI build the board for you.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"></a>
  <a href="https://react.dev" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://firebase.google.com/docs/genkit" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Genkit-F2B800?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Genkit"></a>
</p>

<p align="center">
  <a href="#-project-overview"><strong>Project Overview</strong></a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="#-how-genai-is-used"><strong>How GenAI is Used</strong></a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="#-tech-stack"><strong>Tech Stack</strong></a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="#-core-features"><strong>Core Features</strong></a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="#-getting-started"><strong>Getting Started</strong></a>
</p>

---

## 🚀 Project Overview

Tired of the manual grind of setting up a new project board? **AgileFlow AI** revolutionizes your workflow by leveraging the power of Generative AI. This isn't just another project management tool; it's a **GenAI-powered partner** that understands your project goals and kickstarts your Agile process in seconds.

Simply provide a high-level description of your project, and watch as AgileFlow AI intelligently suggests user stories, constructs a complete Kanban board with relevant epics and tasks, assigns story points, and even provides ongoing agile coaching. It's designed to eliminate the initial friction of project setup, allowing you and your team to focus on what truly matters: building great products.

## 🧠 How GenAI is Used

The magic of AgileFlow AI lies in a multi-step, AI-driven workflow orchestrated by **Genkit**. We use carefully designed prompts and schemas to ensure the AI's output is structured, relevant, and immediately usable.

### 1. AI-Powered User Story Suggestion
The process begins by transforming a simple project idea into actionable user stories.
- **Purpose**: To overcome "blank page" syndrome and provide a solid foundation for project planning.
- **Workflow**:
    1. You provide the project name, team members, and duration.
    2. The application sends these details to a **GenAI model (Gemini)**, prompting it to act as an expert Scrum Master.
    3. The AI generates a list of 5-8 relevant user stories in the standard "As a [user], I want [goal] so that [benefit]" format.
    4. You are presented with these suggestions on a review screen, where you have full control to **add, edit, or delete** stories to perfectly match your vision.

### 2. AI-Powered Scrum Board Initialization
This is where the core value of AgileFlow AI shines. We turn your verified user stories into a fully structured project board.
- **Purpose**: To automate the tedious process of creating epics, breaking down stories into tasks, estimating effort, and assigning work.
- **Workflow**:
    1. Once you approve the user stories, they are sent to a second, more complex AI prompt.
    2. The AI is instructed to act as an expert Scrum Master and perform several actions at once:
        - **Generate Columns**: Create Kanban columns that represent high-level features or epics derived from the stories.
        - **Create Tasks**: Populate each column with smaller, actionable tasks needed to complete the feature.
        - **Estimate Story Points**: Assign story points (1, 2, 3, 5, 8) to each task to represent its complexity.
        - **Assign Team Members**: Intelligently distribute the tasks among the team members you provided.
    3. The AI returns a structured JSON object, which is used to render a complete, interactive Kanban board.

### 3. AI-Powered Contextual Agile Coaching
To help your team stay on track, AgileFlow AI provides continuous, context-aware advice.
- **Purpose**: To offer actionable best practices and improve your team's agile fluency.
- **Workflow**:
    1. At any point, you can click "Get Agile Tip".
    2. The application sends your current project context (e.g., "Project Phase: Execution") to the AI.
    3. The AI, acting as an agile assistant, provides a single, relevant tip and explains the **reasoning** behind its suggestion, helping you learn and adapt.

## 🛠️ Tech Stack

This project is built with a modern, powerful, and scalable tech stack to deliver a seamless user experience.

| Category          | Technology                                                                                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework** | [**Next.js**](https://nextjs.org/) (with App Router) for a high-performance, server-rendered React application.                                                                                         |
| **UI Library** | [**React**](https://react.dev/) for building a dynamic and interactive user interface.                                                                                                                  |
| **Language** | [**TypeScript**](https://www.typescriptlang.org/) for robust, type-safe code.                                                                                                                           |
| **Styling** | [**Tailwind CSS**](https://tailwindcss.com/) with [**ShadCN UI**](https://ui.shadcn.com/) for a beautiful, consistent, and utility-first design system.                                                    |
| **AI & Backend** | [**Genkit**](https://firebase.google.com/docs/genkit) for creating and managing the AI flows that power the board generation and agile tips. Exposed via **Next.js Server Actions**.                     |
| **Forms** | [**React Hook Form**](https://react-hook-form.com/) & [**Zod**](https://zod.dev/) for efficient and schema-validated form management.                                                                      |
| **Drag & Drop** | **Native HTML5 Drag and Drop API** for a lightweight and performant interactive board.                                                                                                                |
| **Charts** | [**Recharts**](https://recharts.org/) for creating beautiful and responsive data visualizations like the Burndown Chart.                                                                                |


## ✨ Core Features

- **🧠 Intelligent Project Kickstart**: Go from idea to a fully-fleshed-out project board in under a minute.
- **🤖 Automated Task Breakdown & Estimation**: Let AI handle the initial story point estimates and task assignments.
- **✅ Human-in-the-Loop Verification**: You always have the final say. Edit, add, or remove AI suggestions before the board is built.
- **✋ Intuitive Drag & Drop Interface**: Seamlessly manage your workflow by moving tasks across columns.
- **📊 Burndown Charts**: Visualize your team's progress and ensure you're on track to meet sprint goals.
- **💡 On-Demand Agile Coach**: Get contextual, AI-generated tips to improve your agile practices.
- **🎨 Sleek, Themed UI**: A modern interface with both light and dark modes for your comfort.

## 🚀 Getting Started

Ready to launch your own AgileFlow AI instance? Follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/notkshitijsingh/agileflow-ai.git
    cd agileflow-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env.local` file in the root of your project and add your AI provider API key (e.g., Google AI Studio).
    ```
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser** to `http://localhost:3000` and start managing your projects with the power of AI!

---

<p align="center">
  Made with ❤️ and a lot of ☕ by <a href="https://github.com/notkshitijsingh">notkshitijsingh</a>
</p>