export async function register() {
  if (typeof window === "undefined") {
    // Polyfill localStorage for server-side rendering
    const storage = new Map<string, string>();

    (global as any).localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      get length() {
        return storage.size;
      },
      key: (index: number) => {
        const keys = Array.from(storage.keys());
        return keys[index] ?? null;
      },
    };
  }
}
