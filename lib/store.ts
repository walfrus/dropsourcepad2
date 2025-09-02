import { create } from 'zustand';
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware';
import { Project, LyricSection, Clip, AppStore, SectionName, UIState } from './types';
import * as idb from './idb';

const safeStorage =
  typeof window !== 'undefined'
    ? createJSONStorage(() => localStorage)
    : undefined as unknown as ReturnType<typeof createJSONStorage>;

const useAppStore = create<AppStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      projects: [],
      currentProjectId: null,
      _hasHydrated: false,
      ui: {
        showTools: false,
        showDrawer: false,
        showOverlay: false,
        showRhymeBook: false,
        showSyllableCounter: false,
        showAIAssist: false,
      },

    createProject: (title = 'Untitled Project') => {
      const now = Date.now();
      const project: Project = {
        id: crypto.randomUUID(),
        title,
        bpm: 120,
        key: 'C',
        createdAt: now,
        updatedAt: now,
        sections: [
          {
            id: crypto.randomUUID(),
            projectId: '', // Will be set after project creation
            name: 'verse',
            text: '',
          },
          {
            id: crypto.randomUUID(),
            projectId: '', // Will be set after project creation
            name: 'chorus',
            text: '',
          },
        ],
        clips: [],
      };

      set((state) => ({
        projects: [...state.projects, project],
        currentProjectId: project.id,
      }));

      // Persist to database
      idb.addProject(project);
      
      // Update sections with projectId and persist them
      const sectionsWithProjectId = project.sections.map(section => ({
        ...section,
        projectId: project.id
      }));
      
      sectionsWithProjectId.forEach((section) => idb.addSection(section));
      
      // Update the project with the corrected sections
      const updatedProject = { ...project, sections: sectionsWithProjectId };
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === project.id ? updatedProject : p
        ),
      }));

      return project;
    },

    setCurrentProject: (id: string) => {
      set({ currentProjectId: id });
    },

    updateProject: (id: string, partial: Partial<Project>) => {
      const now = Date.now();
      const updatedProject = { ...partial, updatedAt: now };

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updatedProject } : p
        ),
      }));

      // Persist to database
      idb.updateProject(id, updatedProject);
    },

    deleteProject: (id: string) => {
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
      }));

      // Persist to database
      idb.deleteProject(id);
    },

    addSection: (projectId: string, name: SectionName) => {
      const section: LyricSection = {
        id: crypto.randomUUID(),
        projectId,
        name,
        text: '',
      };

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, sections: [...p.sections, section] }
            : p
        ),
      }));

      // Persist to database
      idb.addSection(section);

      return section;
    },

    updateSection: (projectId: string, sectionId: string, text: string) => {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                sections: p.sections.map((s) =>
                  s.id === sectionId ? { ...s, text } : s
                ),
              }
            : p
        ),
      }));

      // Persist to database
      idb.updateSection(sectionId, { text });
    },

    addClip: async (projectId: string, file: File, durationMs: number) => {
      const blobKey = crypto.randomUUID();
      const clip: Clip = {
        id: crypto.randomUUID(),
        projectId, // CRITICAL: Always set projectId
        filename: file.name,
        durationMs,
        createdAt: Date.now(),
        blobKey,
      };

      // Store blob in database
      await idb.addBlob(blobKey, file);

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, clips: [...p.clips, clip] }
            : p
        ),
      }));

      // Persist clip to database
      await idb.addClip(clip);

      return clip;
    },

    removeClip: async (projectId: string, clipId: string) => {
      const project = get().projects.find((p) => p.id === projectId);
      const clip = project?.clips.find((c) => c.id === clipId);

      if (clip) {
        // Remove blob from database
        await idb.deleteBlob(clip.blobKey);
      }

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, clips: p.clips.filter((c) => c.id !== clipId) }
            : p
        ),
      }));

      // Persist to database
      await idb.deleteClip(clipId);
    },

    toggleUI: (key: keyof UIState) => {
      set((state) => ({
        ui: { ...state.ui, [key]: !state.ui[key] },
      }));
    },
  })),
  {
    name: "dss-v1",
    version: 2,
          storage: safeStorage,    // <- server gets no-op storage
    partialize: (s) => ({
      projects: s.projects,
      currentProjectId: s.currentProjectId,
    }),
    onRehydrateStorage: () => () => {
      useAppStore.setState({ _hasHydrated: true });
    },
    migrate: (state) => state as any,
  }
));

// Optional final safety net (client only)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const s = useAppStore.getState();
    if (!s._hasHydrated) useAppStore.setState({ _hasHydrated: true });
  }, 0);
}

// Initialize store with data from database
export const initializeStore = async () => {
  try {
    const [projects, sections, clips] = await Promise.all([
      idb.getProjects(),
      idb.getSections(),
      idb.getClips(),
    ]);

    // Reconstruct projects with their sections and clips
    const reconstructedProjects = projects.map((project) => ({
      ...project,
      sections: sections.filter((s) => s.projectId === project.id),
      clips: clips.filter((c) => c.projectId === project.id),
    }));

    // If no projects exist, create a demo project
    if (reconstructedProjects.length === 0) {
      const demoProjectId = crypto.randomUUID();
      const demoProject = {
        id: demoProjectId,
        title: 'First Sketch',
        key: 'C',
        bpm: 120,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        sections: [
          {
            id: crypto.randomUUID(),
            name: 'verse' as SectionName,
            text: '',
            projectId: demoProjectId,
          },
          {
            id: crypto.randomUUID(),
            name: 'chorus' as SectionName,
            text: '',
            projectId: demoProjectId,
          },
        ],
        clips: [],
      };

      reconstructedProjects.push(demoProject);
      
      // Set as current project
      useAppStore.setState({ 
        projects: reconstructedProjects,
        currentProjectId: demoProjectId 
      });
    } else {
      // Just set the projects
      useAppStore.setState({ projects: reconstructedProjects });
    }
  } catch (error) {
    console.error('Failed to initialize store:', error);
  }
};

export default useAppStore;
