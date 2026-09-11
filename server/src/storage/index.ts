export interface PresignedUpload {
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
}
export interface ObjectStorage {
  createUploadUrl(input: {
    objectKey: string;
    contentType: string;
  }): Promise<PresignedUpload>;
  createDownloadUrl(objectKey: string): Promise<string>;
}

export class LocalStorage implements ObjectStorage {
  async createUploadUrl(input: { objectKey: string; contentType: string }) {
    return {
      uploadUrl: `/api/storage/mock-upload?key=${encodeURIComponent(input.objectKey)}`,
      objectKey: input.objectKey,
      expiresIn: 900,
    };
  }
  async createDownloadUrl(objectKey: string) {
    return `/api/storage/mock-download?key=${encodeURIComponent(objectKey)}`;
  }
}

export async function createStorage(): Promise<ObjectStorage> {
  return new LocalStorage();
}
