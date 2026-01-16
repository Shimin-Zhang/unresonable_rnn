// Module content will be loaded here
// This file serves as a placeholder for module content structure

export interface ModuleContent {
  id: number
  sections: Section[]
}

export interface Section {
  id: string
  title: string
  type: 'text' | 'equation' | 'interactive' | 'quiz' | 'code'
  content: string
}

// Placeholder module content - to be populated with actual lesson content
export const moduleContent: Record<number, ModuleContent> = {
  0: {
    id: 0,
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        type: 'text',
        content: 'Welcome to the RNN Learning Experience...',
      },
    ],
  },
}
