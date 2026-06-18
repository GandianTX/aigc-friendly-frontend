// src/features/admin-settings/infrastructure/admin-settings-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { BloggerInfoDTO, UpdateBloggerInfoInputDTO } from './dto';

const BLOGGER_INFO_QUERY = `
  query BloggerInfo {
    bloggerInfo { nickname bio avatarUrl }
  }
`;

const UPDATE_BLOGGER_INFO_MUTATION = `
  mutation UpdateBloggerInfo($input: UpdateBloggerInfoInput!) {
    updateBloggerInfo(input: $input) { nickname bio avatarUrl }
  }
`;

export async function fetchBloggerInfo(): Promise<BloggerInfoDTO> {
  const data = await executeGraphQL<{ bloggerInfo: BloggerInfoDTO }, Record<string, never>>(
    BLOGGER_INFO_QUERY,
    {},
  );
  return data.bloggerInfo;
}

export async function updateBloggerInfo(input: UpdateBloggerInfoInputDTO): Promise<BloggerInfoDTO> {
  const data = await executeGraphQL<
    { updateBloggerInfo: BloggerInfoDTO },
    { input: UpdateBloggerInfoInputDTO }
  >(UPDATE_BLOGGER_INFO_MUTATION, { input });
  return data.updateBloggerInfo;
}
