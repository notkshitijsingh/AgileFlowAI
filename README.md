# AgileFlow AI 🤖✨

<p align="center">
  <strong>The intelligent Agile Scrum assistant that builds your project board for you.</strong>
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
  <a href="#-tech-stack"><strong>Tech Stack</strong></a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="#-core-features"><strong>Core Features</strong></a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="#-how-it-works"><strong>How It Works</strong></a> &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="#-getting-started"><strong>Getting Started</strong></a>
</p>

---

## 🚀 Project Overview

Tired of the manual grind of setting up a new project board? **AgileFlow AI** is here to revolutionize your workflow. This isn't just another project management tool; it's a **GenAI-powered partner** that kickstarts your Agile projects in seconds.

Simply describe your project, and watch as AgileFlow AI intelligently generates a complete Kanban board with relevant columns and starter tasks. From there, manage your project with an intuitive drag-and-drop interface, track your progress with burndown charts, and even get AI-powered Agile coaching tips to keep your team on the right track.

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

## ⚙️ Core Features

- **🧠 AI-Powered Board Generation**: Input your project goals, and let the AI create a tailored Kanban board with columns and tasks.
- **✋ Drag & Drop Interface**: Intuitively move tasks across columns to update their status.
- **📅 Due Dates & Dependencies**: Easily set deadlines and link related tasks to manage complex workflows.
- **📊 Burndown Charts**: Visualize your team's progress and stay on track to meet your sprint goals.
- **💡 Agile Coach**: Get contextual, AI-generated tips to improve your agile practices based on your project's phase.
- **🎨 Themed UI**: A sleek, modern interface with both light and dark modes.

## 🕹️ How It Works

The magic of AgileFlow AI lies in its simple yet powerful workflow that connects a user-friendly frontend with a smart AI backend.

1.  **Project Setup**: The user fills out a simple form with the project name, team members, and duration.
2.  **AI Invocation**: The frontend calls a **Next.js Server Action** (`generateBoardAction`).
3.  **Genkit Flow**: This action triggers the `initializeBoardFlow` in **Genkit**. The flow uses a carefully crafted prompt to instruct a Generative AI model to create a project structure.
4.  **Data Hydration**: The server action receives the AI's response and enriches it by adding unique IDs to each column and task. This is critical for React's rendering and the drag-and-drop functionality.
5.  **Board Rendering**: The complete board data is sent back to the client, where React renders the interactive `<ProjectBoard />`.
6.  **Interactive Management**: The user can now drag tasks, set dates, and get agile tips, with all state changes managed seamlessly on the client.

## 🚀 Getting Started

Ready to launch your own AgileFlow AI instance? Follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/notkshitijsingh/agileflow-ai.git](https://github.com/notkshitijsingh/agileflow-ai.git)
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
  Made with ❤️ and a lot of ☕
</p>
