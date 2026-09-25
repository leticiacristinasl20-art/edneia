// Robust native IndexedDB utility for persisting large datasets (photos, media, hero image)
// without the strict 5MB quota limitation of localStorage.

import { PhotoMemory } from '../data/tributes';

const DB_NAME = 'voneia_tribute_db';
const DB_VERSION = 1;
const STORE_PHOTOS = 'photos';
const STORE_SETTINGS = 'settings';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Loads all custom photos from IndexedDB with automatic fallback/migration from localStorage
 */
export async function getPhotosFromDB(): Promise<PhotoMemory[] | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PHOTOS, 'readonly');
      const store = tx.objectStore(STORE_PHOTOS);
      const req = store.getAll();

      req.onsuccess = () => {
        const result = req.result;
        if (Array.isArray(result) && result.length > 0) {
          resolve(result as PhotoMemory[]);
        } else {
          // Check if localStorage has old photos to migrate
          try {
            const oldLocal = localStorage.getItem('voneia_custom_photos');
            if (oldLocal) {
              const parsed = JSON.parse(oldLocal);
              if (Array.isArray(parsed) && parsed.length > 0) {
                // Migrate to IndexedDB
                savePhotosToDB(parsed);
                // Clear from localStorage to free up space
                localStorage.removeItem('voneia_custom_photos');
                resolve(parsed);
                return;
              }
            }
          } catch {
            // ignore
          }
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Could not open IndexedDB for photos:', err);
    // Fallback to localStorage if IndexedDB fails
    try {
      const saved = localStorage.getItem('voneia_custom_photos');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
}

/**
 * Saves photos to IndexedDB reliably without storage quota errors
 */
export async function savePhotosToDB(photos: PhotoMemory[]): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PHOTOS, 'readwrite');
      const store = tx.objectStore(STORE_PHOTOS);

      // Clear existing records and re-insert in order
      store.clear();
      photos.forEach((photo) => {
        store.put(photo);
      });

      tx.oncomplete = () => {
        // Also remove the heavy item from localStorage to keep localStorage clean
        try {
          localStorage.removeItem('voneia_custom_photos');
        } catch {
          // ignore
        }
        resolve(true);
      };

      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Error saving to IndexedDB:', err);
    // Fallback to localStorage for small photo sets
    try {
      localStorage.setItem('voneia_custom_photos', JSON.stringify(photos.slice(0, 3)));
    } catch {
      // ignore
    }
    return false;
  }
}

/**
 * Clears all custom photos from IndexedDB
 */
export async function clearPhotosFromDB(): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_PHOTOS, 'readwrite');
    tx.objectStore(STORE_PHOTOS).clear();
    try {
      localStorage.removeItem('voneia_custom_photos');
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn('Error clearing IndexedDB:', err);
  }
}

/**
 * Saves arbitrary setting (like birthday date or custom hero image) to IndexedDB
 */
export async function saveSettingToDB(key: string, value: string): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = tx.objectStore(STORE_SETTINGS);
      store.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Gets setting from IndexedDB
 */
export async function getSettingFromDB(key: string): Promise<string | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readonly');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
