export function safeJsonParse<T>(jsonString: string): T | null {
    try {
      const result = JSON.parse(jsonString);
      return result as T; // Cast to type T
    } catch (error) {
      return null;
    }
  }
