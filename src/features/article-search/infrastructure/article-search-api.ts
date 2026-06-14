// src/features/article-search/infrastructure/article-search-api.ts

import { executeGraphQL, PAGINATION_MODE } from '@/shared/graphql';

import type { ArticlesPageDTO } from '@/entities/article';

type SearchArticlesVariables = {
  keyword: string;
  pagination: {
    mode: string;
    page: number;
    pageSize: number;
  };
};

const SEARCH_ARTICLES_QUERY = `
  query SearchArticles($keyword: String!, $pagination: PaginationInput!) {
    searchArticles(keyword: $keyword, pagination: $pagination) {
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

export async function searchArticles(params: {
  keyword: string;
  page: number;
  pageSize: number;
}): Promise<ArticlesPageDTO> {
  const data = await executeGraphQL<{ searchArticles: ArticlesPageDTO }, SearchArticlesVariables>(
    SEARCH_ARTICLES_QUERY,
    {
      keyword: params.keyword,
      pagination: {
        mode: PAGINATION_MODE.OFFSET,
        page: params.page,
        pageSize: params.pageSize,
      },
    },
    { authMode: 'none' },
  );

  return data.searchArticles;
}
