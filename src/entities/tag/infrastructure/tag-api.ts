// src/entities/tag/infrastructure/tag-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { TagDTO } from './dto';

type TagsVariables = Record<string, never>;

const TAGS_QUERY = `
  query Tags {
    tags {
      id name slug articleCount createdAt updatedAt
    }
  }
`;

export async function fetchTags(): Promise<TagDTO[]> {
  const data = await executeGraphQL<{ tags: TagDTO[] }, TagsVariables>(
    TAGS_QUERY,
    {},
    { authMode: 'none' },
  );

  return data.tags;
}
