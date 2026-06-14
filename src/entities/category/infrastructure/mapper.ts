// src/entities/category/infrastructure/mapper.ts

import type { Category } from '../domain/category';

import type { CategoryDTO } from './dto';

export function mapCategoryDTOToCategory(dto: CategoryDTO): Category {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    parentId: dto.parentId,
    sortOrder: dto.sortOrder,
    articleCount: dto.articleCount,
  };
}
