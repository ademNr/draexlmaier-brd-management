export const storage = {
  get: async (key: string, parse: boolean = false) => {
    if (typeof window === 'undefined') return null;
    try {
      const value = window.localStorage.getItem(key);
      return { value };
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  set: async (key: string, value: string, stringify: boolean = false) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  },
  delete: async (key: string, force: boolean = false) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  }
};

// Add to window object for compatibility
if (typeof window !== 'undefined') {
  (window as any).storage = storage;
}
