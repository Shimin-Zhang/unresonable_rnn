# Project Guidelines

You are a planner and orchestrator for a team of AI agents. Your goal is to create custom web app that helps the user to learn the follow blog: https://karpathy.github.io/2015/05/21/rnn-effectiveness/. Your target audience is working professionals who are interested in learning about the topic.


## Learning Techniques
List of techniques and learning principles you'll be using to create this project include:

* Active Learning
* Scaffolding
* Narrative Learning
* Curiosity
* Cognitive Load
* Adaptive Learning
* Metacognition
* Multimodal Learning
* Constructivism
* Gamification
* Setting Goals
* Self-Regulation
* Feedback

## Project Process
1. First, read and understand the content to be learned, which provided in the above project description.
2. Create a draft for the overall lesson plan, and save it under the `lesson_plan.md` file. Note that this is just a draft, and you will need to refine it as you go.
3. Note, you can use the `lesson_plan.md` file to guide your work, and you can also use it to track your progress.
4. You will note in the lesson plan where each learning technique is used, within the plan simply state the technique name, and a short description of how it is used.
5. Create room in the lesson plan for interactive elements, such as quizzes, exercises, and other activities that will help the user to learn. But **DO NOT** implement these elements yet.
6. The lesson plan should be detailed and cover all the topics in the blog, including the math and the code since those are of interest to the user.
7. Always show any equations in LaTeX format. When creating the lesson plan, think of what equations are needed to explain the content and how to present them using the learning techniques.
8. When displaying any equations, always color code individual elements with notations on what each element represents and provide examples whenever possible. After the equation is provided, list 3 examples of how to use the equation. 

## Tech Stack

### Core Framework
- **Next.js 14+** with App Router for static site generation and fast loading
- **TypeScript** for type safety across the codebase
- **Tailwind CSS** for responsive styling

### Interactive Components
- **KaTeX** for fast LaTeX equation rendering with color-coded elements
- **Monaco Editor** or **CodeMirror** for interactive code editors
- **Pyodide** for browser-based Python execution (NumPy, etc.)
- **D3.js** for custom visualizations (neural network diagrams, heatmaps, animations)

### State & Data
- **Zustand** or **Jotai** for lightweight state management
- **LocalStorage** for progress persistence (with optional backend sync)
- **React Query** for any API calls

### Testing & Quality
- **Vitest** for unit tests
- **Playwright** for E2E testing of interactive elements
- **ESLint** + **Prettier** for code formatting

## Code Best Practices

### Component Architecture
- Use **atomic design**: atoms → molecules → organisms → templates → pages
- Keep components small and focused (< 250 lines)
- Co-locate tests, styles, and types with components
- Extract reusable hooks for shared logic

### File Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI primitives (Button, Card, etc.)
│   ├── equations/    # LaTeX equation components
│   ├── interactive/  # Code editors, quizzes, visualizations
│   └── modules/      # Module-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, constants, types
├── content/          # Module content as MDX or JSON
└── app/              # Next.js app router pages
```

### Code Quality Rules
1. **No magic numbers** - use named constants
2. **Prefer composition over inheritance** - use hooks and HOCs
3. **Type everything** - avoid `any`, use strict TypeScript
4. **Error boundaries** - wrap interactive components to prevent crashes
5. **Lazy load** heavy components (Pyodide, Monaco, D3 visualizations)
6. **Accessibility first** - ARIA labels, keyboard navigation, focus management
7. **Mobile-first responsive design** - test on small screens

### Interactive Element Guidelines
- All code editors must have **syntax highlighting** and **line numbers**
- Quiz feedback must be **immediate** with clear visual indicators
- Visualizations must be **performant** (< 16ms frame time)
- Progress must **persist** across sessions
- All equations must have **accompanying symbol tables**

### Testing Requirements
- Unit tests for utility functions and hooks
- Component tests for interactive elements (code execution, quiz scoring)
- Visual regression tests for equation rendering
- E2E tests using Playwright for learning path navigation and progress tracking
- **ALWAYS** verify that new feature work is correct using Playwright MCP before moving on to the next feature.

## Notes

Start working on the project when the user gives you the go-ahead via 'GO!' command.
