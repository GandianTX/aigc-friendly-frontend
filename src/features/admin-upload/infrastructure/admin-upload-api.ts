// src/features/admin-upload/infrastructure/admin-upload-api.ts

import { executeGraphQL, PAGINATION_MODE } from '@/shared/graphql';
import { getAccessToken } from '@/features/admin-auth';

import type { UploadDTO, UploadsPageDTO } from './dto';

type UploadsVariables = {
  pagination: { mode: string; page: number; pageSize: number };
  mimeType?: string | null;
};

const UPLOADS_QUERY = `
  query Uploads($pagination: PaginationArgs!, $mimeType: String) {
    uploads(pagination: $pagination, mimeType: $mimeType) {
      items { id originalName urlPath mimeType sizeBytes createdAt }
      total page pageSize
    }
  }
`;

const DELETE_UPLOAD_MUTATION = `
  mutation DeleteUpload($id: String!) {
    deleteUpload(id: $id)
  }
`;

export async function fetchUploads(params: {
  page: number;
  pageSize: number;
  mimeType?: string;
}): Promise<UploadsPageDTO> {
  const data = await executeGraphQL<{ uploads: UploadsPageDTO }, UploadsVariables>(
    UPLOADS_QUERY,
    {
      pagination: {
        mode: PAGINATION_MODE.OFFSET,
        page: params.page,
        pageSize: params.pageSize,
      },
      mimeType: params.mimeType ?? null,
    },
  );
  return data.uploads;
}

export async function deleteUpload(id: string): Promise<boolean> {
  const data = await executeGraphQL<{ deleteUpload: boolean }, { id: string }>(
    DELETE_UPLOAD_MUTATION,
    { id },
  );
  return data.deleteUpload;
}

export async function uploadImage(file: File): Promise<UploadDTO> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAccessToken();
  const response = await fetch('/upload/image', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`上传失败: ${response.status}`);
  }

  return response.json();
}
