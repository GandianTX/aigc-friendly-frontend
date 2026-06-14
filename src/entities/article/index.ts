// src/entities/article/index.ts

export type { Article, ArticleListItem } from './domain/article';
export { canEdit, canPublish, canUnpublish, formatPublishedDate } from './domain/article-policy';
export type { ArticleStatus } from './domain/article-status';
export { isDraft, isPublished } from './domain/article-status';
export {
  fetchArticleById,
  fetchPrevNextArticle,
  fetchPublishedArticles,
  incrementViewCount,
} from './infrastructure/article-api';
export type { ArticleDTO, ArticlesPageDTO, PrevNextArticleDTO } from './infrastructure/dto';
export {
  mapArticleDTOToArticle,
  mapArticleDTOToListItem,
  mapArticlesPageDTO,
  mapPrevNextArticleDTO,
} from './infrastructure/mapper';
