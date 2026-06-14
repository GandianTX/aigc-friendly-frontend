// src/entities/tag/infrastructure/mapper.ts

import type { Tag } from '../domain/tag';

import type { TagDTO } from './dto';

export function mapTagDTOToTag(dto: TagDTO): Tag {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    articleCount: dto.articleCount,
  };
}
