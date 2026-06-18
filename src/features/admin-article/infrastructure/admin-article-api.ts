// src/features/admin-article/infrastructure/admin-article-api.ts

import { executeGraphQL, PAGINATION_MODE } from '@/shared/graphql';

import type {
  AdminArticleDTO,
  AdminArticlesPageDTO,
  CreateArticleInputDTO,
  UpdateArticleInputDTO,
} from './dto';

type AllArticlesVariables = {
  pagination: { mode: string; page: number; pageSize: number };
  status?: string | null;
};

type ArticleByIdVariables = { id: string };

type CreateArticleVariables = { input: CreateArticleInputDTO };

type UpdateArticleVariables = { input: UpdateArticleInputDTO };

type ArticleIdVariable = { id: string };

type SetTopVariables = { id: string; isTop: boolean };

const ALL_ARTICLES_QUERY = `
  query AllArticles($pagination: PaginationArgs!, $status: ArticleStatus) {
    allArticles(pagination: $pagination, status: $status) {
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

const ARTICLE_BY_ID_ADMIN_QUERY = `
  query ArticleByIdAdmin($id: String!) {
    articleByIdAdmin(id: $id) {
      id title content summary coverImageUrl status isTop publishedAt
      viewCount likeCount commentCount categoryId categoryName
      tags { id name slug }
      createdAt updatedAt
    }
  }
`;

const CREATE_ARTICLE_MUTATION = `
  mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      id title content summary coverImageUrl status isTop publishedAt
      viewCount likeCount commentCount categoryId categoryName
      tags { id name slug }
      createdAt updatedAt
    }
  }
`;

const UPDATE_ARTICLE_MUTATION = `
  mutation UpdateArticle($input: UpdateArticleInput!) {
    updateArticle(input: $input) {
      id title content summary coverImageUrl status isTop publishedAt
      viewCount likeCount commentCount categoryId categoryName
      tags { id name slug }
      createdAt updatedAt
    }
  }
`;

const PUBLISH_ARTICLE_MUTATION = `
  mutation PublishArticle($id: String!) {
    publishArticle(id: $id) {
      id title status publishedAt
    }
  }
`;

const UNPUBLISH_ARTICLE_MUTATION = `
  mutation UnpublishArticle($id: String!) {
    unpublishArticle(id: $id) {
      id title status
    }
  }
`;

const DELETE_ARTICLE_MUTATION = `
  mutation DeleteArticle($id: String!) {
    deleteArticle(id: $id) { deleted id }
  }
`;

const SET_TOP_ARTICLE_MUTATION = `
  mutation SetTopArticle($id: String!, $isTop: Boolean!) {
    setTopArticle(id: $id, isTop: $isTop) {
      id title isTop
    }
  }
`;

export async function fetchAllArticles(params: {
  page: number;
  pageSize: number;
  status?: string;
}): Promise<AdminArticlesPageDTO> {
  const data = await executeGraphQL<
    { allArticles: AdminArticlesPageDTO },
    AllArticlesVariables
  >(
    ALL_ARTICLES_QUERY,
    {
      pagination: {
        mode: PAGINATION_MODE.OFFSET,
        page: params.page,
        pageSize: params.pageSize,
      },
      status: params.status ?? null,
    },
  );
  return data.allArticles;
}

export async function fetchArticleByIdAdmin(id: string): Promise<AdminArticleDTO | null> {
  const data = await executeGraphQL<
    { articleByIdAdmin: AdminArticleDTO | null },
    ArticleByIdVariables
  >(ARTICLE_BY_ID_ADMIN_QUERY, { id });
  return data.articleByIdAdmin;
}

export async function createArticle(input: CreateArticleInputDTO): Promise<AdminArticleDTO> {
  const data = await executeGraphQL<{ createArticle: AdminArticleDTO }, CreateArticleVariables>(
    CREATE_ARTICLE_MUTATION,
    { input },
  );
  return data.createArticle;
}

export async function updateArticle(input: UpdateArticleInputDTO): Promise<AdminArticleDTO> {
  const data = await executeGraphQL<{ updateArticle: AdminArticleDTO }, UpdateArticleVariables>(
    UPDATE_ARTICLE_MUTATION,
    { input },
  );
  return data.updateArticle;
}

export async function publishArticle(id: string): Promise<AdminArticleDTO> {
  const data = await executeGraphQL<{ publishArticle: AdminArticleDTO }, ArticleIdVariable>(
    PUBLISH_ARTICLE_MUTATION,
    { id },
  );
  return data.publishArticle;
}

export async function unpublishArticle(id: string): Promise<AdminArticleDTO> {
  const data = await executeGraphQL<{ unpublishArticle: AdminArticleDTO }, ArticleIdVariable>(
    UNPUBLISH_ARTICLE_MUTATION,
    { id },
  );
  return data.unpublishArticle;
}

export async function deleteArticle(id: string): Promise<{ deleted: boolean; id: string }> {
  const data = await executeGraphQL<
    { deleteArticle: { deleted: boolean; id: string } },
    ArticleIdVariable
  >(DELETE_ARTICLE_MUTATION, { id });
  return data.deleteArticle;
}

export async function setTopArticle(id: string, isTop: boolean): Promise<AdminArticleDTO> {
  const data = await executeGraphQL<{ setTopArticle: AdminArticleDTO }, SetTopVariables>(
    SET_TOP_ARTICLE_MUTATION,
    { id, isTop },
  );
  return data.setTopArticle;
}
