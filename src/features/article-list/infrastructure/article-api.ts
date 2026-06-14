// src/features/article-list/infrastructure/article-api.ts

import { executeGraphQL, PAGINATION_MODE } from '@/shared/graphql';

import type { ArticlesPageDTO } from './dto';

type PublishedArticlesVariables = {
  pagination: {
    mode: string;
    page: number;
    pageSize: number;
  };
  categoryId: string | null;
  tagId: string | null;
};

const PUBLISHED_ARTICLES_QUERY = `
  query PublishedArticles($pagination: PaginationArgs!, $categoryId: String, $tagId: String) {
    publishedArticles(pagination: $pagination, categoryId: $categoryId, tagId: $tagId) {
      items {
        id title summary coverImageUrl status isTop publishedAt
        viewCount likeCount commentCount categoryId categoryName
        tags { id name slug }
        createdAt updatedAt
      }
      total page pageSize
    }
  }
`;

export async function fetchPublishedArticles(params: {
  page: number;
  pageSize: number;
  categoryId?: string;
  tagId?: string;
}): Promise<ArticlesPageDTO> {
  const data = await executeGraphQL<{ publishedArticles: ArticlesPageDTO }, PublishedArticlesVariables>(
    PUBLISHED_ARTICLES_QUERY,
    {
      pagination: {
        mode: PAGINATION_MODE.OFFSET,
        page: params.page,
        pageSize: params.pageSize,
      },
      categoryId: params.categoryId ?? null,
      tagId: params.tagId ?? null,
    },
    { authMode: 'none' },
  );

  return data.publishedArticles;
}
