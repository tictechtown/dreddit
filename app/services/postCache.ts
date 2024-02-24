class SimpleCache {
  private internalCache = new Map();

  setCache<T>(key: string, value: T): void {
    this.internalCache.set(key, value);
  }

  getCache<T>(key: string): T | undefined {
    return this.internalCache.get(key);
  }

  deleteCache(key: string): boolean {
    return this.internalCache.delete(key);
  }

  clearAll(): void {
    return this.internalCache.clear();
  }
}

const postCache = new SimpleCache();

export default postCache;
