// IndexedDB utilities for storing and retrieving user code

const DB_NAME = "LeetcodeDB";
const STORE_NAME = "userCode";
const DB_VERSION = 1;

/**
 * Initialize IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

/**
 * Save code to IndexedDB
 * @param {string} problemId - The ID of the problem
 * @param {string} code - The code content
 * @param {string} language - The programming language
 * @returns {Promise<void>}
 */
export const saveCode = async (problemId, code, language) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const data = {
      id: problemId+"_"+language, // Unique key combining problem ID and language
      code,
      language,
      timestamp: new Date().getTime(),
    };

    const request = store.put(data);

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Error saving code to IndexedDB:", error);
    throw error;
  }
};

/**
 * Load code from IndexedDB
 * @param {string} problemId - The ID of the problem
 * @param {string} language - The programming language
 * @returns {Promise<{code: string, language: string} | null>}
 */
export const loadCode = async (problemId,language) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(problemId+"_"+language);

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve({
            code: result.code,
            language: result.language,
            timestamp: result.timestamp,
          });
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.error("Error loading code from IndexedDB:", error);
    return null;
  }
};

/**
 * Delete code from IndexedDB
 * @param {string} problemId - The ID of the problem
 * @returns {Promise<void>}
 */
export const deleteCode = async (problemId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(problemId);

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Error deleting code from IndexedDB:", error);
    throw error;
  }
};

/**
 * Clear all code from IndexedDB
 * @returns {Promise<void>}
 */
export const clearAllCode = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.clear();

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Error clearing IndexedDB:", error);
    throw error;
  }
};
