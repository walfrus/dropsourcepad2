import Dexie, { Table } from 'dexie';
import { Project, LyricSection, Clip } from './types';

interface BlobRecord {
  key: string;
  data: Blob;
}

class DSSDatabase extends Dexie {
  projects!: Table<Project>;
  sections!: Table<LyricSection>;
  clips!: Table<Clip>;
  blobs!: Table<BlobRecord>;

  constructor() {
    super('dss-db');
    this.version(1).stores({
      projects: 'id, title, bpm, key, createdAt, updatedAt',
      sections: 'id, projectId, name, text',
      clips: 'id, projectId, filename, durationMs, createdAt',
    });
    
    this.version(2).stores({
      clips: 'id, projectId, filename, durationMs, createdAt, blobKey',
      blobs: 'key, data',
    });
  }
}

const db = new DSSDatabase();

// Helper functions for safe database operations
export const safeGetAll = async <T>(table: Table<T>): Promise<T[]> => {
  try {
    return await table.toArray();
  } catch (error) {
    console.warn('IndexedDB failed, falling back to localStorage:', error);
    return getFromLocalStorage(table.name);
  }
};

export const safeAdd = async <T>(table: Table<T>, item: T): Promise<string> => {
  try {
    return await table.add(item);
  } catch (error) {
    console.warn('IndexedDB failed, falling back to localStorage:', error);
    return addToLocalStorage(table.name, item);
  }
};

export const safeUpdate = async <T>(table: Table<T>, key: string, changes: Partial<T>): Promise<void> => {
  try {
    await table.update(key, changes as any);
  } catch (error) {
    console.warn('IndexedDB failed, falling back to localStorage:', error);
    updateInLocalStorage(table.name, key, changes);
  }
};

export const safeDelete = async <T>(table: Table<T>, key: string): Promise<void> => {
  try {
    await table.delete(key);
  } catch (error) {
    console.warn('IndexedDB failed, falling back to localStorage:', error);
    deleteFromLocalStorage(table.name, key);
  }
};

// LocalStorage fallback functions
const getFromLocalStorage = <T>(tableName: string): T[] => {
  try {
    const data = localStorage.getItem(`dss-${tableName}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const addToLocalStorage = <T>(tableName: string, item: T): string => {
  try {
    const data = getFromLocalStorage<T>(tableName);
    const id = crypto.randomUUID();
    const newItem = { ...item, id };
    data.push(newItem);
    localStorage.setItem(`dss-${tableName}`, JSON.stringify(data));
    return id;
  } catch {
    return crypto.randomUUID();
  }
};

const updateInLocalStorage = <T>(tableName: string, key: string, changes: Partial<T>): void => {
  try {
    const data = getFromLocalStorage<T>(tableName);
    const index = data.findIndex((item: any) => item.id === key);
    if (index !== -1) {
      data[index] = { ...data[index], ...changes };
      localStorage.setItem(`dss-${tableName}`, JSON.stringify(data));
    }
  } catch {
    // Silently fail
  }
};

const deleteFromLocalStorage = <T>(tableName: string, key: string): void => {
  try {
    const data = getFromLocalStorage<T>(tableName);
    const filtered = data.filter((item: any) => item.id !== key);
    localStorage.setItem(`dss-${tableName}`, JSON.stringify(filtered));
  } catch {
    // Silently fail
  }
};

// Project operations
export const getProjects = (): Promise<Project[]> => safeGetAll(db.projects);
export const addProject = (project: Project): Promise<string> => safeAdd(db.projects, project);
export const updateProject = (id: string, changes: Partial<Project>): Promise<void> => safeUpdate(db.projects, id, changes);
export const deleteProject = (id: string): Promise<void> => safeDelete(db.projects, id);

// Section operations
export const getSections = (): Promise<LyricSection[]> => safeGetAll(db.sections);
export const addSection = (section: LyricSection): Promise<string> => safeAdd(db.sections, section);
export const updateSection = (id: string, changes: Partial<LyricSection>): Promise<void> => safeUpdate(db.sections, id, changes);
export const deleteSection = (id: string): Promise<void> => safeDelete(db.sections, id);

// Clip operations
export const getClips = (): Promise<Clip[]> => safeGetAll(db.clips);
export const addClip = (clip: Clip): Promise<string> => safeAdd(db.clips, clip);
export const updateClip = (id: string, changes: Partial<Clip>): Promise<void> => safeUpdate(db.clips, id, changes);
export const deleteClip = (id: string): Promise<void> => safeDelete(db.clips, id);

// Blob operations
export const addBlob = (key: string, blob: Blob): Promise<string> => safeAdd(db.blobs, { key, data: blob });
export const getBlob = async (key: string): Promise<Blob | null> => {
  try {
    const record = await db.blobs.get(key);
    return record?.data || null;
  } catch (error) {
    console.warn('Failed to get blob from IndexedDB:', error);
    return null;
  }
};
export const deleteBlob = (key: string): Promise<void> => safeDelete(db.blobs, key);

export default db;
