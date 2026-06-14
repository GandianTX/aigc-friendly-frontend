// src/shared/graphql/pagination.ts

/** 分页模式常量，与后端 GraphQL PaginationMode enum 对齐 */
export const PAGINATION_MODE = {
  OFFSET: 'OFFSET',
  CURSOR: 'CURSOR',
} as const;

export type PaginationMode = (typeof PAGINATION_MODE)[keyof typeof PAGINATION_MODE];
