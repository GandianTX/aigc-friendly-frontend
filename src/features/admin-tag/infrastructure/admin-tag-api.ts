// src/features/admin-tag/infrastructure/admin-tag-api.ts

import { executeGraphQL } from '@/shared/graphql';
import { fetchTags } from '@/entities/tag';
import type { TagDTO } from '@/entities/tag';

export { fetchTags };
export type { TagDTO };

import type { CreateTagInputDTO, UpdateTagInputDTO } from './dto';

const CREATE_TAG_MUTATION = `
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) { id name slug articleCount createdAt updatedAt }
  }
`;

const UPDATE_TAG_MUTATION = `
  mutation UpdateTag($input: UpdateTagInput!) {
    updateTag(input: $input) { id name slug articleCount createdAt updatedAt }
  }
`;

const DELETE_TAG_MUTATION = `
  mutation DeleteTag($id: String!) {
    deleteTag(id: $id) { deleted id }
  }
`;

export async function createTag(input: CreateTagInputDTO): Promise<TagDTO> {
  const data = await executeGraphQL<{ createTag: TagDTO }, { input: CreateTagInputDTO }>(
    CREATE_TAG_MUTATION,
    { input },
  );
  return data.createTag;
}

export async function updateTag(input: UpdateTagInputDTO): Promise<TagDTO> {
  const data = await executeGraphQL<{ updateTag: TagDTO }, { input: UpdateTagInputDTO }>(
    UPDATE_TAG_MUTATION,
    { input },
  );
  return data.updateTag;
}

export async function deleteTag(id: string): Promise<{ deleted: boolean; id: string }> {
  const data = await executeGraphQL<
    { deleteTag: { deleted: boolean; id: string } },
    { id: string }
  >(DELETE_TAG_MUTATION, { id });
  return data.deleteTag;
}
