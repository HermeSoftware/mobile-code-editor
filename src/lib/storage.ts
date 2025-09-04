interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileItem[];
  isOpen?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectData {
  id: string;
  name: string;
  files: FileItem[];
  settings: {
    theme: 'dark' | 'light';
    fontSize: number;
    tabSize: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

class IndexedDBStorage {
  private dbName = 'MobileCodeEditor';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('name', 'name', { unique: false });
          projectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Files store
        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'id' });
          fileStore.createIndex('projectId', 'projectId', { unique: false });
          fileStore.createIndex('name', 'name', { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // Project operations
  async saveProject(project: ProjectData): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects', 'files'], 'readwrite');
    
    // Save project
    await new Promise<void>((resolve, reject) => {
      const request = transaction.objectStore('projects').put({
        ...project,
        updatedAt: new Date(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Save files
    for (const file of project.files) {
      await new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('files').put({
          ...file,
          projectId: project.id,
          updatedAt: new Date(),
        });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  async getProject(id: string): Promise<ProjectData | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects', 'files'], 'readonly');

    // Get project
    const project = await new Promise<ProjectData | null>((resolve, reject) => {
      const request = transaction.objectStore('projects').get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });

    if (!project) return null;

    // Get files
    const files = await new Promise<FileItem[]>((resolve, reject) => {
      const request = transaction.objectStore('files')
        .index('projectId')
        .getAll(id);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    return {
      ...project,
      files,
    };
  }

  async getAllProjects(): Promise<ProjectData[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects'], 'readonly');

    return new Promise((resolve, reject) => {
      const request = transaction.objectStore('projects')
        .index('updatedAt')
        .getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProject(id: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects', 'files'], 'readwrite');

    // Delete project
    await new Promise<void>((resolve, reject) => {
      const request = transaction.objectStore('projects').delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Delete files
    await new Promise<void>((resolve, reject) => {
      const request = transaction.objectStore('files')
        .index('projectId')
        .openCursor(IDBKeyRange.only(id));
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Settings operations
  async saveSetting(key: string, value: unknown): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['settings'], 'readwrite');

    return new Promise((resolve, reject) => {
      const request = transaction.objectStore('settings').put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting(key: string, defaultValue?: unknown): Promise<unknown> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['settings'], 'readonly');

    return new Promise((resolve, reject) => {
      const request = transaction.objectStore('settings').get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : defaultValue);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // File operations
  async saveFile(projectId: string, file: FileItem): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['files'], 'readwrite');

    return new Promise((resolve, reject) => {
      const request = transaction.objectStore('files').put({
        ...file,
        projectId,
        updatedAt: new Date(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFile(projectId: string, fileId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['files'], 'readwrite');

    return new Promise((resolve, reject) => {
      const request = transaction.objectStore('files').delete(fileId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Export/Import
  async exportProject(projectId: string): Promise<string> {
    const project = await this.getProject(projectId);
    if (!project) throw new Error('Project not found');
    
    return JSON.stringify(project, null, 2);
  }

  async importProject(jsonData: string): Promise<ProjectData> {
    const project = JSON.parse(jsonData) as ProjectData;
    project.id = Date.now().toString();
    project.createdAt = new Date();
    project.updatedAt = new Date();
    
    await this.saveProject(project);
    return project;
  }

  // Clear all data
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects', 'files', 'settings'], 'readwrite');

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('projects').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('files').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('settings').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    ]);
  }
}

export const storage = new IndexedDBStorage();
export type { FileItem, ProjectData };
