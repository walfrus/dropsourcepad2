// Persistence utilities for debounced saving and localStorage fallback

export class Debouncer<T> {
  private timeoutId: NodeJS.Timeout | null = null;
  private delay: number;

  constructor(delay: number = 400) {
    this.delay = delay;
  }

  debounce(callback: (value: T) => void, value: T): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      callback(value);
      this.timeoutId = null;
    }, this.delay);
  }

  cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// LocalStorage utilities with error handling
export const localStorage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
};

// SessionStorage utilities with error handling
export const sessionStorage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to read from sessionStorage:', error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to write to sessionStorage:', error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error);
      return false;
    }
  }
};

// Auto-save utility for form inputs
export class AutoSaver<T> {
  private debouncer: Debouncer<T>;
  private key: string;
  private defaultValue: T;

  constructor(key: string, defaultValue: T, delay: number = 400) {
    this.key = key;
    this.defaultValue = defaultValue;
    this.debouncer = new Debouncer(delay);
  }

  save(value: T): void {
    this.debouncer.debounce((val) => {
      localStorage.set(this.key, val);
    }, value);
  }

  load(): T {
    return localStorage.get(this.key, this.defaultValue);
  }

  cancel(): void {
    this.debouncer.cancel();
  }
}


