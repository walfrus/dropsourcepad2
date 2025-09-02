export type SectionName = 'verse' | 'chorus' | 'bridge';

export interface LyricSection {
  id: string;
  projectId: string;  // Add this field to link sections to projects
  name: SectionName;
  text: string;
}

export interface Clip {
  id: string;
  projectId: string;     // REQUIRED — must always be set
  filename: string;
  durationMs: number;
  createdAt: number;     // Date.now()
  blobKey: string;       // Dexie key to blob store
}

export interface Project {
  id: string;
  title: string;
  bpm: number;
  key: string;           // e.g., 'C', 'G#m'
  createdAt: number;
  updatedAt: number;
  sections: LyricSection[];
  clips: Clip[];
}

export interface UIState {
  showTools: boolean;
  showDrawer: boolean;
  showOverlay: boolean;
  showRhymeBook: boolean;
  showSyllableCounter: boolean;
  showAIAssist: boolean;
}

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  ui: UIState;
}

export interface AppActions {
  createProject: (title?: string) => Project;
  setCurrentProject: (id: string) => void;
  updateProject: (id: string, partial: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addSection: (projectId: string, name: SectionName) => LyricSection;
  updateSection: (projectId: string, sectionId: string, text: string) => void;
  addClip: (projectId: string, file: File, durationMs: number) => Promise<Clip>;
  removeClip: (projectId: string, clipId: string) => Promise<void>;
  toggleUI: (key: keyof UIState) => void;
}

export type AppStore = AppState & AppActions;
