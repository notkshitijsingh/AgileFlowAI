# Deploying Your AgileFlow AI Project to Vercel

This guide provides step-by-step instructions for deploying your Next.js application to Vercel.

## Prerequisites

1.  **A GitHub/GitLab/Bitbucket Account**: Vercel works by connecting to your Git repository.
2.  **A Vercel Account**: You can sign up for a free account on the [Vercel website](https://vercel.com).
3.  **Your Project on GitHub**: You'll need to have this project's code pushed to a repository on GitHub (or another supported Git provider).
4.  **Google AI API Key**: Your application uses Genkit with the Google AI plugin to generate the project board and agile tips. You will need a Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## Step 1: Push Your Project to GitHub

If you haven't already, get your project onto GitHub.

1.  **Initialize Git**: Open a terminal in your local project folder and run:
    ```bash
    git init
    ```

2.  **Add and Commit Files**:
    ```bash
    git add .
    git commit -m "Initial commit"
    ```

3.  **Create a GitHub Repository**: Go to GitHub and create a new repository. Do *not* initialize it with a README or .gitignore file, as your project already has these.

4.  **Link and Push Your Code**: Follow the instructions on GitHub for "…or push an existing repository from the command line". It will look like this:
    ```bash
    git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Import Your Project on Vercel

Now, let's get Vercel set up.

1.  **Log in to Vercel**: Go to your [Vercel Dashboard](https://vercel.com/dashboard).

2.  **Import Project**:
    *   Click the "**Add New...**" button and select "**Project**".
    *   The "Import Git Repository" screen will appear. If you haven't already, connect your GitHub account.
    *   Find your project's repository in the list and click the "**Import**" button next to it.

---

## Step 3: Configure Your Project

Vercel will automatically detect that you're deploying a Next.js project. You just need to configure the environment variables for the AI functionality.

1.  **Project Settings**: Vercel will likely pre-fill the "Framework Preset" as "Next.js". You can leave all the Build and Output Settings as their defaults.

2.  **Environment Variables**: This is the most important step.
    *   Expand the "Environment Variables" section.
    *   You need to add your Google AI API key so Genkit can work.
    *   Add a new variable:
        *   **Name**: `GEMINI_API_KEY`
        *   **Value**: Paste your Google AI API key here.
    *   Click the "**Add**" button to save the variable.

3.  **Deploy**:
    *   Click the "**Deploy**" button.
    *   Vercel will now start building and deploying your application. You can watch the progress in the build logs.

---

## Step 4: All Done!

Once the deployment is complete, Vercel will provide you with a URL where your live application can be accessed. Congratulations, your AgileFlow AI app is now deployed!
