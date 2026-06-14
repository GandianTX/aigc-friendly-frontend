// src/entities/article/infrastructure/article-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { ArticleDTO, ArticlesPageDTO, PrevNextArticleDTO } from './dto';

type PublishedArticlesVariables = {
  page: number;
  pageSize: number;
  categoryId: string | null;
  tagId: string | null;
};

type ArticleByIdVariables = {
  id: string;
};

type PrevNextArticleVariables = {
  articleId: string;
};

type IncrementViewCountVariables = {
  id: string;
};

const PUBLISHED_ARTICLES_QUERY = `
  query PublishedArticles($page: Int!, $pageSize: Int!, $categoryId: String, $tagId: String) {
    publishedArticles(page: $page, pageSize: $pageSize, categoryId: $categoryId, tagId: $tagId) {
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

const ARTICLE_BY_ID_QUERY = `
  query ArticleById($id: String!) {
    articleById(id: $id) {
      id title content summary coverImageUrl status isTop publishedAt
      viewCount likeCount commentCount categoryId categoryName
      tags { id name slug }
      createdAt updatedAt
    }
  }
`;

const PREV_NEXT_ARTICLE_QUERY = `
  query PrevNextArticle($articleId: String!) {
    prevNextArticle(articleId: $articleId) {
      prev { id title publishedAt }
      next { id title publishedAt }
    }
  }
`;

const INCREMENT_VIEW_COUNT_MUTATION = `
  mutation IncrementViewCount($id: String!) {
    incrementViewCount(id: $id)
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
      page: params.page,
      pageSize: params.pageSize,
      categoryId: params.categoryId ?? null,
      tagId: params.tagId ?? null,
    },
    { authMode: 'none' },
  );

  return data.publishedArticles;
}

export async function fetchArticleById(id: string): Promise<ArticleDTO | null> {
  const data = await executeGraphQL<{ articleById: ArticleDTO | null }, ArticleByIdVariables>(
    ARTICLE_BY_ID_QUERY,
    { id },
    { authMode: 'none' },
  );

  return data.articleById;
}

export async function fetchPrevNextArticle(articleId: string): Promise<PrevNextArticleDTO> {
  const data = await executeGraphQL<{ prevNextArticle: PrevNextArticleDTO }, PrevNextArticleVariables>(
    PREV_NEXT_ARTICLE_QUERY,
    { articleId },
    { authMode: 'none' },
  );

  return data.prevNextArticle;
}

export async function incrementViewCount(id: string): Promise<boolean> {
  const data = await executeGraphQL<{ incrementViewCount: boolean }, IncrementViewCountVariables>(
    INCREMENT_VIEW_COUNT_MUTATION,
    { id },
    { authMode: 'none' },
  );

  return data.incrementViewCount;
}
