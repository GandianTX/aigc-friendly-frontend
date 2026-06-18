// src/features/admin-upload/infrastructure/dto.ts

export interface UploadDTO {
  readonly id: string;
  readonly originalName: string;
  readonly urlPath: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly createdAt: string;
}

export interface UploadsPageDTO {
  readonly items: UploadDTO[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
