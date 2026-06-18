// src/features/admin-link/infrastructure/admin-link-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { BlogLinkDTO, CreateBlogLinkInputDTO, UpdateBlogLinkInputDTO } from './dto';

const BLOG_LINKS_QUERY = `
  query BlogLinks {
    blogLinks { id name url description logoUrl sortOrder createdAt updatedAt }
  }
`;

const CREATE_BLOG_LINK_MUTATION = `
  mutation CreateBlogLink($input: CreateBlogLinkInput!) {
    createBlogLink(input: $input) { id name url description logoUrl sortOrder createdAt updatedAt }
  }
`;

const UPDATE_BLOG_LINK_MUTATION = `
  mutation UpdateBlogLink($input: UpdateBlogLinkInput!) {
    updateBlogLink(input: $input) { id name url description logoUrl sortOrder createdAt updatedAt }
  }
`;

const DELETE_BLOG_LINK_MUTATION = `
  mutation DeleteBlogLink($id: String!) {
    deleteBlogLink(id: $id) { deleted id }
  }
`;

export async function fetchBlogLinks(): Promise<BlogLinkDTO[]> {
  const data = await executeGraphQL<{ blogLinks: BlogLinkDTO[] }, Record<string, never>>(
    BLOG_LINKS_QUERY,
    {},
  );
  return data.blogLinks;
}

export async function createBlogLink(input: CreateBlogLinkInputDTO): Promise<BlogLinkDTO> {
  const data = await executeGraphQL<
    { createBlogLink: BlogLinkDTO },
    { input: CreateBlogLinkInputDTO }
  >(CREATE_BLOG_LINK_MUTATION, { input });
  return data.createBlogLink;
}

export async function updateBlogLink(input: UpdateBlogLinkInputDTO): Promise<BlogLinkDTO> {
  const data = await executeGraphQL<
    { updateBlogLink: BlogLinkDTO },
    { input: UpdateBlogLinkInputDTO }
  >(UPDATE_BLOG_LINK_MUTATION, { input });
  return data.updateBlogLink;
}

export async function deleteBlogLink(id: string): Promise<{ deleted: boolean; id: string }> {
  const data = await executeGraphQL<
    { deleteBlogLink: { deleted: boolean; id: string } },
    { id: string }
  >(DELETE_BLOG_LINK_MUTATION, { id });
  return data.deleteBlogLink;
}
