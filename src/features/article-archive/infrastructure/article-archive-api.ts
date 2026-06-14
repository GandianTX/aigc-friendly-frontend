// src/features/article-archive/infrastructure/article-archive-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { ArticlesPageDTO, ArchiveDTO } from './dto';

export type { ArchiveDTO } from './dto';

const ARTICLE_ARCHIVES_QUERY = `
  query ArticleArchives {
    articleArchives {
      year month count
    }
  }
`;

export async function fetchArticleArchives(): Promise<ArchiveDTO[]> {
  const data = await executeGraphQL<{ articleArchives: ArchiveDTO[] }, Record<string, never>>(
    ARTICLE_ARCHIVES_QUERY,
    {},
    { authMode: 'none' },
  );

  return data.articleArchives;
}

type ArticlesByArchiveVariables = {
  year: number;
  month: number;
  page: number;
  pageSize: number;
};

const ARTICLES_BY_ARCHIVE_QUERY = `
  query ArticlesByArchive($year: Int!, $month: Int!, $page: Int, $pageSize: Int) {
    articlesByArchive(year: $year, month: $month, page: $page, pageSize: $pageSize) {
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

export async function fetchArticlesByArchive(params: {
  year: number;
  month: number;
  page: number;
  pageSize: number;
}): Promise<ArticlesPageDTO> {
  const data = await executeGraphQL<{ articlesByArchive: ArticlesPageDTO }, ArticlesByArchiveVariables>(
    ARTICLES_BY_ARCHIVE_QUERY,
    {
      year: params.year,
      month: params.month,
      page: params.page,
      pageSize: params.pageSize,
    },
    { authMode: 'none' },
  );

  return data.articlesByArchive;
}
