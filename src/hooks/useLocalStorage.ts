function useLocalStorage() {
  const get = (key: string): string | null => {
    try {
      const value = localStorage.getItem(key);
      return value ?? null;
    } catch (error) {
      console.error(`Error getting localStorage key “${key}”:`, error);
      return null;
    }
  };

  const set = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  const remove = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key “${key}”:`, error);
    }
  };

  return { get, set, remove };
}

export default useLocalStorage;
