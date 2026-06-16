// src/features/article-like/infrastructure/like-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { LikeResultDTO } from './dto';

type ToggleLikeVariables = {
  input: { articleId: string; fingerprint: string };
};

type LikeCountVariables = {
  articleId: string;
};

type IsLikedVariables = {
  articleId: string;
  fingerprint: string;
};

const TOGGLE_LIKE_MUTATION = `
  mutation ToggleArticleLike($input: ToggleLikeInput!) {
    toggleArticleLike(input: $input) {
      isLiked
      likeCount
    }
  }
`;

const ARTICLE_LIKE_COUNT_QUERY = `
  query ArticleLikeCount($articleId: String!) {
    articleLikeCount(articleId: $articleId)
  }
`;

const IS_ARTICLE_LIKED_QUERY = `
  query IsArticleLiked($articleId: String!, $fingerprint: String!) {
    isArticleLiked(articleId: $articleId, fingerprint: $fingerprint)
  }
`;

export async function toggleArticleLike(
  articleId: string,
  fingerprint: string,
): Promise<LikeResultDTO> {
  const data = await executeGraphQL<
    { toggleArticleLike: LikeResultDTO },
    ToggleLikeVariables
  >(TOGGLE_LIKE_MUTATION, { input: { articleId, fingerprint } }, { authMode: 'none' });

  return data.toggleArticleLike;
}

export async function fetchArticleLikeCount(articleId: string): Promise<number> {
  const data = await executeGraphQL<
    { articleLikeCount: number },
    LikeCountVariables
  >(ARTICLE_LIKE_COUNT_QUERY, { articleId }, { authMode: 'none' });

  return data.articleLikeCount;
}

export async function fetchIsArticleLiked(
  articleId: string,
  fingerprint: string,
): Promise<boolean> {
  const data = await executeGraphQL<
    { isArticleLiked: boolean },
    IsLikedVariables
  >(IS_ARTICLE_LIKED_QUERY, { articleId, fingerprint }, { authMode: 'none' });

  return data.isArticleLiked;
}

/**
 * 基于浏览器信息生成访客指纹。
 * 使用 UA hash 作为简单指纹，不涉及精确追踪。
 */
export function generateFingerprint(): string {
  const ua = navigator.userAgent;
  // 简单 hash：djb2 算法
  let hash = 5381;
  for (let i = 0; i < ua.length; i++) {
    hash = ((hash << 5) + hash + ua.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
